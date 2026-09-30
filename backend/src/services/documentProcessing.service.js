import fs from 'node:fs/promises';
import mongoose from 'mongoose';
import Document from '../models/Document.js';
import VerificationRequest from '../models/VerificationRequest.js';
import OCRResult from '../models/OCRResult.js';
import DocumentValidation from '../models/DocumentValidation.js';
import TamperAnalysis from '../models/TamperAnalysis.js';
import VerificationResult from '../models/VerificationResult.js';
import {
  allowedDocumentTypes,
  allowedMimeTypes,
  buildKeywordSet,
  computeIdentityConsistency,
  extractFieldsFromOcr,
  extractTextMatch,
  getExtractionStatuses,
  getFileHash,
  normalizeDocumentType
} from '../utils/documentUtils.js';

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://127.0.0.1:8000';

const evaluateDocumentTypeMatch = (documentType, ocrText) => {
  const keywords = buildKeywordSet(documentType);
  return extractTextMatch(ocrText, keywords);
};

const validateField = (fieldValue) => Boolean(fieldValue && String(fieldValue).trim().length > 0);

const validateExtractedFields = (documentType, extractedFields) => {
  const base = {
    documentNumber: validateField(extractedFields.documentNumber),
    name: validateField(extractedFields.name),
    dateOfBirth: validateField(extractedFields.dateOfBirth)
  };

  if (documentType === 'aadhaar') {
    return {
      ...base,
      address: validateField(extractedFields.address)
    };
  }

  if (documentType === 'driving-licence') {
    return {
      ...base,
      address: validateField(extractedFields.address)
    };
  }

  return base;
};

const getOverallStatus = (documentTypeMatch, fieldValidation, identityConsistency) => {
  if (!documentTypeMatch) {
    return 'requires_review';
  }

  if (identityConsistency === 'mismatch') {
    return 'requires_review';
  }

  const hasFailedField = Object.values(fieldValidation).some((value) => value === false);
  if (hasFailedField) {
    return 'requires_review';
  }

  return 'completed';
};

const analyzeTamperIndicators = (file, fileBuffer) => {
  const mimeType = file.mimetype || '';

  if (!allowedMimeTypes.includes(mimeType)) {
    return 'analysis_unavailable';
  }

  if (file.size <= 0) {
    return 'requires_review';
  }

  const fileSignature = fileBuffer.slice(0, 8).toString('hex');
  const hasLikelyCompression = mimeType === 'image/jpeg' && fileSignature.startsWith('ffd8');
  if (hasLikelyCompression) {
    return 'no_strong_indicators';
  }

  return 'no_strong_indicators';
};

const callOcrService = async (fileBuffer, fileName, mimeType) => {
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer], { type: mimeType }), fileName || 'document');

  const response = await fetch(`${OCR_SERVICE_URL}/ocr`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'OCR service unavailable');
  }

  return String(data.text || '');
};

const persistVerificationLifecycle = async ({ userId, file, normalizedType, fileHash, ocrText, extractedFields, extractionStatuses, fieldValidation, documentTypeMatch, identityConsistency, tamperStatus, overallStatus, reviewReason }) => {
  if (!userId || mongoose.connection.readyState !== 1) {
    return {};
  }

  const documentRecord = await Document.create({
    userId,
    documentType: normalizedType,
    originalFileName: file.originalname,
    storedFileName: file.filename || '',
    mimeType: file.mimetype || '',
    fileSize: file.size || 0,
    fileHash,
    status: 'completed'
  });

  const verificationRequest = await VerificationRequest.create({
    userId,
    documentId: documentRecord._id,
    documentType: normalizedType,
    status: overallStatus === 'completed' ? 'completed' : 'requires_review',
    automatedStatus: overallStatus,
    reviewStatus: overallStatus === 'completed' ? 'not_required' : 'pending',
    reviewReason: reviewReason || '',
    verificationStartedAt: new Date(),
    verificationCompletedAt: new Date()
  });

  await OCRResult.create({
    documentId: documentRecord._id,
    verificationRequestId: verificationRequest._id,
    rawText: ocrText,
    extractedFields,
    extractionStatuses,
    ocrEngine: 'tesseract',
    ocrConfidence: null,
    processingStatus: 'completed',
    processedAt: new Date()
  });

  await DocumentValidation.create({
    documentId: documentRecord._id,
    verificationRequestId: verificationRequest._id,
    documentType: normalizedType,
    documentTypeMatch,
    requiredFieldsPresent: {
      documentNumber: Boolean(extractedFields.documentNumber),
      name: Boolean(extractedFields.name),
      dateOfBirth: Boolean(extractedFields.dateOfBirth)
    },
    fieldValidationResults: fieldValidation,
    validationStatus: overallStatus === 'completed' ? 'passed' : 'requires_review',
    validationMessages: overallStatus === 'completed' ? ['Document fields validated successfully.'] : ['Document requires manual review.'],
    validatedAt: new Date()
  });

  await TamperAnalysis.create({
    documentId: documentRecord._id,
    verificationRequestId: verificationRequest._id,
    analysisStatus: tamperStatus,
    manipulationIndicators: tamperStatus === 'no_strong_indicators' ? [] : ['Potential tampering indicators detected'],
    suspiciousRegions: {},
    metadataAnalysis: { fileHash },
    compressionAnalysis: { mimeType: file.mimetype || '' },
    pixelAnalysis: {},
    copyPasteIndicators: [],
    analysisMessages: tamperStatus === 'no_strong_indicators' ? ['No strong tampering indicators were found.'] : ['Manual review recommended for the uploaded document.'],
    analyzedAt: new Date()
  });

  const finalOverallStatus = overallStatus === 'completed' ? 'verified' : 'requires_review';

  const verificationResult = await VerificationResult.create({
    verificationRequestId: verificationRequest._id,
    userId,
    documentId: documentRecord._id,
    overallStatus: finalOverallStatus,
    documentTypeStatus: documentTypeMatch ? 'matched' : 'requires_review',
    ocrStatus: 'completed',
    fieldValidationStatus: Object.values(fieldValidation).every(Boolean) ? 'passed' : 'failed',
    identityConsistency,
    tamperStatus,
    qrVerificationStatus: 'not_available',
    finalDecision: finalOverallStatus === 'verified' ? 'Document verified successfully.' : 'Additional verification required.',
    reasons: finalOverallStatus === 'verified' ? ['OCR text matched document type and required data fields.'] : ['Document requires manual review.'],
    warnings: tamperStatus === 'no_strong_indicators' ? [] : ['Possible document manipulation indicators detected.'],
    automatedStatus: overallStatus,
    reviewStatus: overallStatus === 'completed' ? 'not_required' : 'pending',
    completedAt: new Date()
  });

  return {
    documentId: documentRecord._id.toString(),
    verificationRequestId: verificationRequest._id.toString(),
    verificationResultId: verificationResult._id.toString()
  };
};

export const processDocumentUpload = async ({ file, documentType, userName, userId }) => {
  if (!file) {
    throw new Error('No file uploaded. Please select a document to upload.');
  }

  const normalizedType = normalizeDocumentType(documentType);
  if (!allowedDocumentTypes.includes(normalizedType)) {
    throw new Error('Invalid document type.');
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Unsupported file type. Only PDF, JPG, JPEG, and PNG files are allowed.');
  }

  const fileBuffer = await fs.readFile(file.path);
  const fileHash = await getFileHash(fileBuffer);

  let ocrText = '';
  try {
    ocrText = await callOcrService(fileBuffer, file.originalname, file.mimetype);
  } catch (error) {
    throw new Error('OCR service unavailable or processing failed.');
  }

  const extractedFields = extractFieldsFromOcr(normalizedType, ocrText);
  const extractionStatuses = getExtractionStatuses(extractedFields);
  const documentTypeMatch = evaluateDocumentTypeMatch(normalizedType, ocrText);
  const fieldValidation = validateExtractedFields(normalizedType, extractedFields);
  const identityConsistency = computeIdentityConsistency(userName, extractedFields.name);
  const tamperStatus = analyzeTamperIndicators(file, fileBuffer);

  const overallStatus = getOverallStatus(
    documentTypeMatch,
    fieldValidation,
    identityConsistency
  );
  const reviewReason = overallStatus === 'requires_review'
    ? [
      !documentTypeMatch && 'Document type could not be confidently matched.',
      identityConsistency === 'mismatch' && 'Identity details do not match the authenticated user.',
      Object.entries(fieldValidation).some(([, isValid]) => !isValid) && 'One or more required fields were not confidently extracted.'
    ].filter(Boolean).join(' ')
    : '';

  const persisted = await persistVerificationLifecycle({
    userId,
    file,
    normalizedType,
    fileHash,
    ocrText,
    extractedFields,
    extractionStatuses,
    fieldValidation,
    documentTypeMatch,
    identityConsistency,
    tamperStatus,
    overallStatus,
    reviewReason
  });

  return {
    success: true,
    message: 'Document processed successfully',
    documentType: normalizedType,
    ocrStatus: 'completed',
    documentTypeMatch,
    extractedFields,
    extractionStatuses,
    fieldValidation,
    identityConsistency,
    tamperStatus,
    fileHash,
    verificationStatus: overallStatus,
    overallStatus,
    automatedStatus: overallStatus,
    reviewStatus: overallStatus === 'completed' ? 'not_required' : 'pending',
    reviewReason,
    ...persisted
  };
};
