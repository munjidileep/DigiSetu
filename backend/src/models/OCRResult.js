import mongoose from 'mongoose';

const ocrResultSchema = new mongoose.Schema({
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
  rawText: {
    type: String,
    default: ''
  },
  extractedFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  extractionStatuses: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ocrEngine: {
    type: String,
    default: 'tesseract'
  },
  ocrConfidence: {
    type: Number,
    default: null
  },
  processingStatus: {
    type: String,
    enum: ['completed', 'failed'],
    default: 'completed'
  },
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.OCRResult || mongoose.model('OCRResult', ocrResultSchema, 'ocr_results');
