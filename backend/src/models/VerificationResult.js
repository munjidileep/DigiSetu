import mongoose from 'mongoose';

const verificationResultSchema = new mongoose.Schema({
  verificationRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerificationRequest',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    index: true
  },
  overallStatus: {
    type: String,
    enum: ['verified', 'requires_review', 'potential_manipulation', 'failed'],
    default: 'requires_review'
  },
  documentTypeStatus: {
    type: String,
    default: ''
  },
  ocrStatus: {
    type: String,
    default: 'completed'
  },
  fieldValidationStatus: {
    type: String,
    default: 'failed'
  },
  identityConsistency: {
    type: String,
    enum: ['matched', 'partially_matched', 'mismatch', 'unavailable'],
    default: 'unavailable'
  },
  tamperStatus: {
    type: String,
    enum: ['no_strong_indicators', 'potential_manipulation', 'requires_review', 'analysis_unavailable'],
    default: 'analysis_unavailable'
  },
  qrVerificationStatus: {
    type: String,
    default: 'not_available'
  },
  finalDecision: {
    type: String,
    default: 'Additional verification required'
  },
  reasons: {
    type: [String],
    default: []
  },
  warnings: {
    type: [String],
    default: []
  },
  automatedStatus: {
    type: String,
    enum: ['completed', 'requires_review', 'failed'],
    default: 'requires_review'
  },
  reviewStatus: {
    type: String,
    enum: ['not_required', 'pending', 'approved', 'rejected', 'request_more_information'],
    default: 'not_required'
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.VerificationResult || mongoose.model('VerificationResult', verificationResultSchema, 'verification_results');
