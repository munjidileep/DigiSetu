import Document from '../models/Document.js';
import VerificationRequest from '../models/VerificationRequest.js';
import VerificationResult from '../models/VerificationResult.js';
import { processDocumentUpload } from '../services/documentProcessing.service.js';

/**
 * Upload document for identity verification
 * Validates document type and file format
 *
 * Expected request:
 * - multipart/form-data
 * - documentType: string (aadhaar, pan, driving-licence)
 * - document: file (PDF, JPG, JPEG, PNG)
 */
export const uploadDocument = async (req, res) => {
  try {
    const { documentType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a document to upload.'
      });
    }

    const result = await processDocumentUpload({
      file,
      documentType,
      userName: req.session?.user?.name || '',
      userId: req.session?.user?.userId || ''
    });

    return res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      ...result
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process document. Please try again.'
    });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const userId = req.session?.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    const documents = await Document.find({ userId }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      documents: documents.map((doc) => ({
        id: doc._id.toString(),
        documentType: doc.documentType,
        originalFileName: doc.originalFileName,
        status: doc.status,
        fileHash: doc.fileHash,
        createdAt: doc.createdAt,
        mimeType: doc.mimeType
      }))
    });
  } catch (error) {
    console.error('Get user documents error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch documents.'
    });
  }
};

export const getMyVerificationHistory = async (req, res) => {
  try {
    const userId = req.session?.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    const requests = await VerificationRequest.find({ userId }).sort({ createdAt: -1 }).lean();
    const documentIds = requests.map((request) => request.documentId);
    const documents = await Document.find({ _id: { $in: documentIds } }).lean();
    const documentMap = new Map(documents.map((doc) => [doc._id.toString(), doc]));

    const verificationHistory = await Promise.all(requests.map(async (request) => {
      const result = await VerificationResult.findOne({ verificationRequestId: request._id }).lean();
      const document = documentMap.get(request.documentId.toString());
      const reviewStatus = result?.reviewStatus || request.reviewStatus || 'not_required';
      const status = result?.overallStatus || request.status;
      const statusLabel = reviewStatus === 'approved'
        ? 'Verified - Reviewed'
        : reviewStatus === 'rejected'
          ? 'Verification Failed - Reviewed'
          : reviewStatus === 'request_more_information'
            ? 'Additional Information Required'
            : status === 'requires_review'
              ? 'Under Review'
              : status;

      return {
        id: request._id.toString(),
        documentId: request.documentId.toString(),
        documentType: request.documentType,
        originalFileName: document?.originalFileName || 'Unknown document',
        status,
        statusLabel,
        automatedStatus: result?.automatedStatus || request.automatedStatus || status,
        reviewStatus,
        reviewReason: request.reviewReason || result?.reasons?.join(' ') || '',
        createdAt: request.createdAt,
        completedAt: result?.completedAt || request.verificationCompletedAt || null,
        finalDecision: result?.finalDecision || 'Review pending'
      };
    }));

    return res.status(200).json({
      success: true,
      verificationHistory
    });
  } catch (error) {
    console.error('Get verification history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch verification history.'
    });
  }
};
