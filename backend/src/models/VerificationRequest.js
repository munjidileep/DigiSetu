import mongoose from 'mongoose';

const verificationRequestSchema = new mongoose.Schema({
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
  documentType: {
    type: String,
    enum: ['aadhaar', 'pan', 'driving-licence'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'requires_review'],
    default: 'pending'
  },
  automatedStatus: {
    type: String,
    enum: ['pending', 'completed', 'requires_review', 'failed'],
    default: 'pending'
  },
  reviewStatus: {
    type: String,
    enum: ['not_required', 'pending', 'approved', 'rejected', 'request_more_information'],
    default: 'not_required'
  },
  reviewReason: {
    type: String,
    default: ''
  },
  verificationStartedAt: {
    type: Date,
    default: null
  },
  verificationCompletedAt: {
    type: Date,
    default: null
  },
  failureReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.VerificationRequest || mongoose.model('VerificationRequest', verificationRequestSchema, 'verification_requests');
