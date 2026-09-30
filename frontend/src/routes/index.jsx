import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AuthCallback from '../pages/AuthCallback';
import Profile from '../pages/Profile';
import VerifyIdentity from '../pages/VerifyIdentity';
import MyDocuments from '../pages/MyDocuments';
import VerificationHistory from '../pages/VerificationHistory';
import ReviewerQueue from '../pages/ReviewerQueue';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/auth/callback" element={<AuthCallback />} />

    {/* Protected Routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/verify"
      element={
        <ProtectedRoute>
          <VerifyIdentity />
        </ProtectedRoute>
      }
    />
    <Route
      path="/documents"
      element={
        <ProtectedRoute>
          <MyDocuments />
        </ProtectedRoute>
      }
    />
    <Route
      path="/verification-history"
      element={
        <ProtectedRoute>
          <VerificationHistory />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reviewer/reviews"
      element={
        <ProtectedRoute>
          <ReviewerQueue />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />

    {/* Legacy route redirects for backward compatibility */}
    <Route path="/home" element={<Navigate to="/dashboard" replace />} />
    <Route path="/verification" element={<Navigate to="/verify" replace />} />
    <Route path="/customer/dashboard" element={<Navigate to="/dashboard" replace />} />
    <Route path="/customer/login" element={<Navigate to="/login" replace />} />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
