import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: ['aadhaar', 'pan', 'driving-licence'],
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  storedFileName: {
    type: String,
    default: ''
  },
  storageKey: {
    type: String,
    default: ''
  },
  mimeType: {
    type: String,
    default: ''
  },
  fileSize: {
    type: Number,
    default: 0
  },
  fileHash: {
    type: String,
    required: true,
    index: true,
    comment: 'SHA-256 hash used for integrity tracking only; it does not prove authenticity.'
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'failed', 'deleted'],
    default: 'uploaded'
  },
  retentionUntil: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.Document || mongoose.model('Document', documentSchema, 'documents');
