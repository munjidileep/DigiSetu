// Express app configuration - middleware, routes, error handling
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import documentProcessingRoutes from './routes/documentProcessing.routes.js';
import reviewRoutes from './routes/review.routes.js';

const app = express();

// CORS - allow frontend to access backend with credentials
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session store for authentication
app.use(session({
  secret: process.env.SESSION_SECRET || 'digisetu-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Use true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Mount routes
app.use('/api', authRoutes);
app.use('/api', documentRoutes);
app.use('/api', documentProcessingRoutes);
app.use('/api', reviewRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

export default app;
