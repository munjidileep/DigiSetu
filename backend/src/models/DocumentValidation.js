import mongoose from 'mongoose';

const documentValidationSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    index: true
  },
  verificationRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerificationRequest',
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: ['aadhaar', 'pan', 'driving-licence'],
    required: true
  },
  documentTypeMatch: {
    type: Boolean,
    default: false
  },
  requiredFieldsPresent: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  formatChecks: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  fieldValidationResults: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  validationStatus: {
    type: String,
    enum: ['passed', 'failed', 'requires_review'],
    default: 'failed'
  },
  validationMessages: {
    type: [String],
    default: []
  },
  validatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.DocumentValidation || mongoose.model('DocumentValidation', documentValidationSchema, 'document_validations');
