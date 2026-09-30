import mongoose from 'mongoose';

const qrVerificationSchema = new mongoose.Schema({
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
  qrDetected: {
    type: Boolean,
    default: false
  },
  qrData: {
    type: String,
    default: ''
  },
  decodedFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  dataMatchStatus: {
    type: String,
    default: 'not_available'
  },
  verificationSource: {
    type: String,
    default: 'not_available'
  },
  verificationStatus: {
    type: String,
    default: 'not_available'
  },
  verifiedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.QRVerification || mongoose.model('QRVerification', qrVerificationSchema, 'qr_verifications');
