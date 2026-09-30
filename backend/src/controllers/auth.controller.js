// Authentication controller - eSignet OAuth integration
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const privateKeyPath = fileURLToPath(new URL('../../private-key.pem', import.meta.url));
const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

// Health check - verify backend is running
export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication backend is running"
  });
};

// Initiate eSignet OAuth flow - redirect browser to authorization endpoint
export const initiateESignetAuth = async (req, res) => {
  try {
    const response = await fetch(process.env.ESIGNET_WELL_KNOWN_URL);

    if (!response.ok) {
      throw new Error('Well-known endpoint request failed');
    }

    const configuration = await response.json();
    const authorizationUrl = new URL(configuration.authorization_endpoint);
    
    authorizationUrl.search = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.ESIGNET_CLIENT_ID,
      redirect_uri: process.env.ESIGNET_REDIRECT_URI,
      scope: 'openid profile',
      nonce: crypto.randomUUID(),
      state: crypto.randomUUID()
    }).toString();

    console.log('Authorization URL:', authorizationUrl.toString());
    res.redirect(authorizationUrl.toString());
  } catch (error) {
    res.status(502).json({
      success: false,
      message: 'Unable to retrieve eSignet authorization configuration'
    });
  }
};

// eSignet callback - exchange auth code for token and create session
export const handleESignetCallback = async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Authorization code exchange failed'
    });
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Authorization code exchange failed'
    });
  }

  // Exchange authorization code for access token
  let token;

  try {
    token = await exchangeAuthorizationCode(String(code));
  } catch (exchangeError) {
    console.error('Token exchange error:', exchangeError.message);
    return res.status(502).json({
      success: false,
      message: 'Authorization code exchange failed',
      error: exchangeError.message
    });
  }

  // Retrieve user info and create session
  try {
    const userInfo = await retrieveUserInfo(token.access_token);

    const reviewerSubjects = (process.env.REVIEWER_ESIGNET_SUBJECTS || '')
      .split(',')
      .map((subject) => subject.trim())
      .filter(Boolean);
    const isConfiguredReviewer = reviewerSubjects.includes(userInfo.sub);

    const userRecord = await User.findOneAndUpdate(
      { esignetSubjectId: userInfo.sub },
      {
        esignetSubjectId: userInfo.sub,
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone_number || '',
        profilePhoto: userInfo.picture || '',
        status: 'active',
        lastLoginAt: new Date(),
        ...(isConfiguredReviewer ? { role: 'reviewer' } : {})
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    req.session.user = {
      sub: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email,
      phone_number: userInfo.phone_number,
      userId: userRecord._id.toString(),
      role: userRecord.role
    };

    console.log('Session created for user:', userInfo.sub);

    // Redirect to frontend dashboard
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/home`);
  } catch (userInfoError) {
    console.error('eSignet UserInfo request failed:', userInfoError.message);
    return res.status(502).json({
      success: false,
      message: 'Unable to retrieve authenticated user information',
      error: userInfoError.message
    });
  }
};

// Exchange authorization code for access token
const exchangeAuthorizationCode = async (code) => {
  const discoveryResponse = await fetch(process.env.ESIGNET_WELL_KNOWN_URL);

  if (!discoveryResponse.ok) {
    throw new Error('Unable to retrieve token endpoint');
  }

  const configuration = await discoveryResponse.json();
  const privateKey = await readFile(privateKeyPath, 'utf8');
  const issuedAt = Math.floor(Date.now() / 1000);
  const clientAssertion = jwt.sign(
    {
      iss: process.env.ESIGNET_CLIENT_ID,
      sub: process.env.ESIGNET_CLIENT_ID,
      aud: configuration.token_endpoint,
      iat: issuedAt,
      exp: issuedAt + 300,
      jti: crypto.randomUUID()
    },
    privateKey,
    {
      algorithm: 'RS256',
      header: {
        alg: 'RS256',
        typ: 'JWT',
        kid: 'digisetu-dev-01'
      }
    }
  );

  const tokenResponse = await fetch(configuration.token_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.ESIGNET_REDIRECT_URI,
      client_id: process.env.ESIGNET_CLIENT_ID,
      client_assertion_type: clientAssertionType,
      client_assertion: clientAssertion,
      scope: 'openid profile'
    })
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    console.error('Token endpoint error:', errorBody);
    throw new Error(`Token endpoint request failed with status ${tokenResponse.status}: ${errorBody}`);
  }

  const token = await tokenResponse.json();

  if (!token.access_token) {
    throw new Error('Token response did not contain an access token');
  }

  console.log('Token exchange successful');
  console.log('Token type:', token.token_type);
  console.log('Expires in:', token.expires_in);
  console.log('Token response keys:', Object.keys(token));
  console.log('ID token present:', token.id_token ? 'YES' : 'NO');
  
  // Decode access token to check its full structure (JWT format)
  try {
    const accessTokenParts = token.access_token.split('.');
    if (accessTokenParts.length === 3) {
      const atPayload = JSON.parse(Buffer.from(accessTokenParts[1], 'base64').toString());
      console.log('Access token full payload:', JSON.stringify(atPayload, null, 2));
    }
  } catch (e) {
    console.log('Access token is not a JWT or cannot be decoded');
  }

  return token;
};

// Retrieve user info from eSignet using access token
const retrieveUserInfo = async (accessToken) => {
  const discoveryResponse = await fetch(process.env.ESIGNET_WELL_KNOWN_URL);

  if (!discoveryResponse.ok) {
    throw new Error('Unable to retrieve UserInfo endpoint');
  }

  const configuration = await discoveryResponse.json();
  
  console.log('UserInfo endpoint:', configuration.userinfo_endpoint);
  console.log('Making UserInfo request with Bearer token...');
  
  const userInfoResponse = await fetch(configuration.userinfo_endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/jwt, application/json'
    }
  });

  if (!userInfoResponse.ok) {
    const errorBody = await userInfoResponse.text();
    console.error('UserInfo endpoint error:', errorBody);
    console.error('UserInfo response status:', userInfoResponse.status);
    console.error('UserInfo response Content-Type:', userInfoResponse.headers.get('content-type'));
    throw new Error(`UserInfo request failed with status ${userInfoResponse.status}: ${errorBody}`);
  }

  const contentType = userInfoResponse.headers.get('content-type');
  console.log('UserInfo response Content-Type:', contentType);
  
  // Check if response is a signed JWT (JWS)
  if (contentType && contentType.includes('application/jwt')) {
    const jwtString = await userInfoResponse.text();
    console.log('UserInfo returned as JWT/JWS, decoding...');
    
    // Decode JWT without verification (for development)
    const jwtParts = jwtString.split('.');
    if (jwtParts.length === 3) {
      const payload = JSON.parse(Buffer.from(jwtParts[1], 'base64').toString());
      console.log('UserInfo JWT claims:', Object.keys(payload));
      return payload;
    } else {
      throw new Error('Invalid JWT format from UserInfo endpoint');
    }
  }
  
  // Plain JSON response
  const userInfo = await userInfoResponse.json();
  console.log('UserInfo retrieved successfully');
  console.log('Claims received:', Object.keys(userInfo).join(', '));

  return userInfo;
};

// Extract specific user claims from OIDC response
const selectUserClaims = (userInfo) => {
  const claimNames = [
    'sub',
    'name',
    'given_name',
    'family_name',
    'email',
    'phone_number',
    'picture'
  ];

  return Object.fromEntries(
    claimNames
      .filter((claimName) => userInfo[claimName] !== undefined)
      .map((claimName) => [claimName, userInfo[claimName]])
  );
};

// Get eSignet OIDC config (dev/testing endpoint)
export const getESignetConfig = async (req, res) => {
  try {
    const response = await fetch(process.env.ESIGNET_WELL_KNOWN_URL);

    if (!response.ok) {
      throw new Error('Well-known endpoint request failed');
    }

    const configuration = await response.json();
    const publicConfiguration = {
      issuer: configuration.issuer,
      authorization_endpoint: configuration.authorization_endpoint,
      token_endpoint: configuration.token_endpoint,
      userinfo_endpoint: configuration.userinfo_endpoint,
      jwks_uri: configuration.jwks_uri,
      scopes_supported: configuration.scopes_supported,
      response_types_supported: configuration.response_types_supported,
      acr_values_supported: configuration.acr_values_supported,
      token_endpoint_auth_methods_supported:
        configuration.token_endpoint_auth_methods_supported
    };

    res.status(200).json(publicConfiguration);
  } catch (error) {
    res.status(502).json({
      success: false,
      message: 'Unable to retrieve eSignet OpenID configuration'
    });
  }
};

// Get current authenticated user from session
export const getCurrentUser = (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({
      success: true,
      authenticated: true,
      user: req.session.user
    });
  }

  return res.status(200).json({
    success: true,
    authenticated: false,
    user: null
  });
};

// Logout - destroy session and clear cookies
export const logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to logout'
        });
      }

      res.clearCookie('connect.sid'); // Default session cookie name
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } else {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
};
