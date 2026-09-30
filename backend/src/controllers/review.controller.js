import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Document from '../models/Document.js';
import VerificationRequest from '../models/VerificationRequest.js';
import OCRResult from '../models/OCRResult.js';
import DocumentValidation from '../models/DocumentValidation.js';
import TamperAnalysis from '../models/TamperAnalysis.js';
import VerificationResult from '../models/VerificationResult.js';
import Review from '../models/Review.js';

const uploadsRoot = path.resolve(fileURLToPath(new URL('../../uploads/temp', import.meta.url)));
const decisions = ['APPROVE', 'REJECT', 'REQUEST_MORE_INFORMATION'];

const toId = (value) => value?.toString();

const getLatestReview = async (verificationRequestId) => Review.findOne({ verificationRequestId })
  .sort({ reviewedAt: -1 })
  .lean();

const getEvidence = async (request) => {
  const [document, ocr, validation, tamper, result, latestReview] = await Promise.all([
    Document.findById(request.documentId).lean(),
    OCRResult.findOne({ verificationRequestId: request._id }).lean(),
    DocumentValidation.findOne({ verificationRequestId: request._id }).lean(),
    TamperAnalysis.findOne({ verificationRequestId: request._id }).lean(),
    VerificationResult.findOne({ verificationRequestId: request._id }).lean(),
    getLatestReview(request._id)
  ]);

  return { document, ocr, validation, tamper, result, latestReview };
};

const queueItem = ({ request, evidence }) => ({
  id: toId(request._id),
  documentId: toId(request.documentId),
  documentType: request.documentType,
  submittedAt: request.createdAt,
  status: evidence.result?.overallStatus || request.status,
  reviewStatus: request.reviewStatus,
  reason: request.reviewReason || evidence.result?.reasons?.join(' ') || 'Automated checks need human review.',
  extractedName: evidence.ocr?.extractedFields?.name || '',
  extractedDateOfBirth: evidence.ocr?.extractedFields?.dateOfBirth || '',
  identityConsistency: evidence.result?.identityConsistency || 'unavailable',
  tamperStatus: evidence.tamper?.analysisStatus || 'analysis_unavailable',
  qrVerificationStatus: evidence.result?.qrVerificationStatus || 'not_available'
});

export const getReviewQueue = async (req, res) => {
  try {
    const requests = await VerificationRequest.find({
      status: 'requires_review',
      $or: [
        { reviewStatus: { $in: ['pending', 'request_more_information'] } },
        { reviewStatus: { $exists: false } },
        { reviewStatus: null }
      ]
    }).sort({ createdAt: 1 }).lean();

    const items = await Promise.all(requests.map(async (request) => ({
      request,
      evidence: await getEvidence(request)
    })));

    return res.status(200).json({
      success: true,
      reviews: items.map(queueItem)
    });
  } catch (error) {
    console.error('Get review queue error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch the reviewer queue.' });
  }
};

export const getReviewDetails = async (req, res) => {
  try {
    const request = await VerificationRequest.findById(req.params.id).lean();
    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    const evidence = await getEvidence(request);
    return res.status(200).json({
      success: true,
      review: {
        ...queueItem({ request, evidence }),
        originalFileName: evidence.document?.originalFileName || 'Document',
        mimeType: evidence.document?.mimeType || 'application/octet-stream',
        ocrText: evidence.ocr?.rawText || '',
        extractedFields: evidence.ocr?.extractedFields || {},
        extractionStatuses: evidence.ocr?.extractionStatuses || {},
        fieldValidation: evidence.validation?.fieldValidationResults || {},
        requiredFieldsPresent: evidence.validation?.requiredFieldsPresent || {},
        documentTypeMatch: evidence.validation?.documentTypeMatch ?? false,
        tamperIndicators: evidence.tamper?.manipulationIndicators || [],
        tamperMessages: evidence.tamper?.analysisMessages || [],
        automatedStatus: evidence.result?.automatedStatus || request.automatedStatus,
        finalDecision: evidence.result?.finalDecision || 'Additional verification required.',
        latestReview: evidence.latestReview ? {
          decision: evidence.latestReview.decision,
          reviewComment: evidence.latestReview.reviewComment,
          reviewedAt: evidence.latestReview.reviewedAt
        } : null
      }
    });
  } catch (error) {
    console.error('Get review details error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch review details.' });
  }
};

export const streamReviewDocument = async (req, res) => {
  try {
    const request = await VerificationRequest.findById(req.params.id).lean();
    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    const document = await Document.findById(request.documentId).lean();
    if (!document?.storedFileName) {
      return res.status(404).json({ success: false, message: 'Stored document is not available.' });
    }

    const fileName = path.basename(document.storedFileName);
    const filePath = path.resolve(uploadsRoot, fileName);
    if (!filePath.startsWith(`${uploadsRoot}${path.sep}`)) {
      return res.status(403).json({ success: false, message: 'Invalid document path.' });
    }

    return res.sendFile(filePath, {
      headers: { 'Content-Disposition': `inline; filename="${document.originalFileName}"` }
    }, (error) => {
      if (error && !res.headersSent) {
        res.status(error.statusCode || 404).json({ success: false, message: 'Stored document is not available.' });
      }
    });
  } catch (error) {
    console.error('Stream review document error:', error);
    return res.status(500).json({ success: false, message: 'Unable to open the document.' });
  }
};

export const decideReview = async (req, res) => {
  const { decision, reviewComment = '' } = req.body;
  if (!decisions.includes(decision)) {
    return res.status(400).json({ success: false, message: 'Invalid review decision.' });
  }

  try {
    const request = await VerificationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }
    if (request.status !== 'requires_review') {
      return res.status(409).json({ success: false, message: 'This verification request is not awaiting review.' });
    }

    const statusByDecision = {
      APPROVE: { requestStatus: 'completed', reviewStatus: 'approved', resultStatus: 'verified', finalDecision: 'Approved by reviewer.' },
      REJECT: { requestStatus: 'failed', reviewStatus: 'rejected', resultStatus: 'failed', finalDecision: 'Rejected by reviewer.' },
      REQUEST_MORE_INFORMATION: { requestStatus: 'requires_review', reviewStatus: 'request_more_information', resultStatus: 'requires_review', finalDecision: 'Additional information required.' }
    }[decision];

    const review = await Review.create({
      reviewerId: req.reviewer._id,
      verificationRequestId: request._id,
      decision,
      reviewComment: String(reviewComment).trim().slice(0, 2000)
    });

    request.status = statusByDecision.requestStatus;
    request.reviewStatus = statusByDecision.reviewStatus;
    request.verificationCompletedAt = decision === 'REQUEST_MORE_INFORMATION' ? null : new Date();
    await request.save();

    const result = await VerificationResult.findOneAndUpdate(
      { verificationRequestId: request._id },
      {
        overallStatus: statusByDecision.resultStatus,
        reviewStatus: statusByDecision.reviewStatus,
        reviewerId: req.reviewer._id,
        reviewedAt: review.reviewedAt,
        finalDecision: statusByDecision.finalDecision,
        completedAt: decision === 'REQUEST_MORE_INFORMATION' ? null : review.reviewedAt
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      decision,
      status: result?.overallStatus || statusByDecision.resultStatus,
      message: statusByDecision.finalDecision
    });
  } catch (error) {
    console.error('Review decision error:', error);
    return res.status(500).json({ success: false, message: 'Unable to save the review decision.' });
  }
};
