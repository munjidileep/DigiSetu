// Authentication routes - defines all auth endpoints
import express from 'express';
import {
  healthCheck,
  initiateESignetAuth,
  handleESignetCallback,
  getESignetConfig,
  getCurrentUser,
  logout
} from '../controllers/auth.controller.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// eSignet OAuth endpoints
router.get('/auth/esignet', initiateESignetAuth);
router.get('/auth/esignet/callback', handleESignetCallback);
router.get('/auth/esignet/config', getESignetConfig);

// Session management
router.get('/auth/me', getCurrentUser);
router.post('/auth/logout', logout);

export default router;
