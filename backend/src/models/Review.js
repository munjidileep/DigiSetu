import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  verificationRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerificationRequest',
    required: true,
    index: true
  },
  decision: {
    type: String,
    enum: ['APPROVE', 'REJECT', 'REQUEST_MORE_INFORMATION'],
    required: true
  },
  reviewComment: {
    type: String,
    default: ''
  },
  reviewedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema, 'reviews');
