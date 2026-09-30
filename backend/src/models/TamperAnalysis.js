import mongoose from 'mongoose';

const tamperAnalysisSchema = new mongoose.Schema({
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
  analysisStatus: {
    type: String,
    enum: ['no_strong_indicators', 'potential_manipulation', 'requires_review', 'analysis_unavailable'],
    default: 'analysis_unavailable'
  },
  manipulationIndicators: {
    type: [String],
    default: []
  },
  suspiciousRegions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  metadataAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  compressionAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  pixelAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  copyPasteIndicators: {
    type: [String],
    default: []
  },
  analysisMessages: {
    type: [String],
    default: []
  },
  analyzedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.TamperAnalysis || mongoose.model('TamperAnalysis', tamperAnalysisSchema, 'tamper_analysis');
