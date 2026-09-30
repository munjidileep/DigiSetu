// Authentication middleware - protect routes requiring authentication

/**
 * Middleware to check if user is authenticated via session
 * Requires user to have completed eSignet authentication
 */
export const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is authenticated, proceed to next middleware/route handler
    return next();
  }

  // User is not authenticated
  return res.status(401).json({
    success: false,
    message: 'Authentication required. Please log in.'
  });
};
