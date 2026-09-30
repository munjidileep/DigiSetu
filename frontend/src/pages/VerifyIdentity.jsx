import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ShieldCheck, FileText, Upload, CheckCircle2, 
  AlertCircle, X, FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import api from '../services/api';

const VerifyIdentity = () => {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/login');
    }
  }, [authenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const documentTypes = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Card',
      description: 'Government-issued identity document.',
      icon: FileText,
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Permanent Account Number card.',
      icon: FileText,
    },
    {
      id: 'driving-licence',
      name: 'Driving Licence',
      description: 'Government-issued driving licence.',
      icon: FileText,
    },
  ];

  const verificationSteps = [
    { number: 1, title: 'Choose a document', description: 'Select document type' },
    { number: 2, title: 'Upload your document', description: 'Upload image or PDF' },
    { number: 3, title: 'Review your document', description: 'Verify details' },
    { number: 4, title: 'Verify your identity', description: 'Document processing' },
    { number: 5, title: 'View your result', description: 'Verification result' },
  ];

  const handleDocumentSelect = (docType) => {
    setSelectedDocument(docType);
    setCurrentStep(2);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Clear previous errors
    setValidationError(null);
    setUploadError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Only PDF, JPG, JPEG, and PNG files are allowed.');
      return;
    }

    // Validate file size (max 5MB to match backend)
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      setValidationError('File size must not exceed 5 MB.');
      return;
    }

    setUploadedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    setCurrentStep(3);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setValidationError(null);
    setUploadError(null);
    setUploadSuccess(false);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setSelectedDocument(null);
      setValidationError(null);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      handleRemoveFile();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    // Clear previous messages
    setUploadError(null);
    setValidationError(null);
    setUploadSuccess(false);

    // Frontend validation
    if (!selectedDocument) {
      setValidationError('Please select a document type.');
      return;
    }

    if (!uploadedFile) {
      setValidationError('Please choose a file.');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('documentType', selectedDocument.id); // Map to backend value
    formData.append('document', uploadedFile);

    setUploading(true);

    try {
      // Send request to backend
      // Note: Axios will automatically detect FormData and set the correct Content-Type with boundary
      const response = await api.post('/documents/upload', formData);

      // Handle success
      if (response.data.success) {
        setUploadSuccess(true);
        setVerificationResult(response.data);
        setCurrentStep(5);
      } else {
        setUploadError(response.data.message || 'Document processing failed.');
      }
    } catch (error) {
      // Handle errors
      console.error('Upload error:', error);

      if (error.response?.data?.message) {
        // Backend error message
        setUploadError(error.response.data.message);
      } else if (error.request) {
        // Network error
        setUploadError('Network error. Please check your connection and try again.');
      } else {
        // Other errors
        setUploadError('Failed to upload document. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Navbar */}
      <Navbar />

      {/* Background */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 pt-[72px]">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-secondary)] to-[#6366F1] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheck size={32} className="text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-2">
              Verify Your Identity
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Verify your identity securely by submitting a supported identity document.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {verificationSteps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        step.number < currentStep
                          ? 'bg-green-500 text-white'
                          : step.number === currentStep
                          ? 'bg-[var(--color-secondary)] text-white'
                          : step.number > 3
                          ? 'bg-gray-200 text-gray-400'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.number < currentStep ? <CheckCircle2 size={20} /> : step.number}
                    </div>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-2 text-center max-w-[80px] hidden sm:block">
                      {step.title}
                    </p>
                  </div>
                  {index < verificationSteps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-1 ${
                        step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Choose Document */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <Card.Body>
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                      Choose your document
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {documentTypes.map((doc) => {
                        const Icon = doc.icon;
                        return (
                          <button
                            key={doc.id}
                            onClick={() => handleDocumentSelect(doc)}
                            className="p-5 border-2 border-[var(--color-border)] rounded-xl hover:border-[var(--color-secondary)] hover:bg-blue-50/50 transition-all text-left group"
                          >
                            <Icon size={32} className="text-[var(--color-secondary)] mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
                              {doc.name}
                            </h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              {doc.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Upload Document */}
            {currentStep === 2 && selectedDocument && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <Card.Body>
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                      Upload your document
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                      Selected document: <strong>{selectedDocument.name}</strong>
                    </p>

                    {/* Validation Error */}
                    {validationError && (
                      <div className="mb-6">
                        <Alert
                          variant="error"
                          description={validationError}
                          dismissible
                          onDismiss={() => setValidationError(null)}
                        />
                      </div>
                    )}

                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                        dragActive
                          ? 'border-[var(--color-secondary)] bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-base font-medium text-[var(--color-text-primary)] mb-2">
                        Drag and drop your document here
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-4">or</p>
                      <label 
                        htmlFor="file-upload"
                        className="inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-[var(--transition-fast)] select-none cursor-pointer focus-ring bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] active:scale-[0.98] h-9 px-4 text-sm gap-2"
                      >
                        Choose File
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-[var(--color-text-disabled)] mt-4">
                        Supported formats: JPG, JPEG, PNG, PDF (Max 5 MB)
                      </p>
                    </div>

                    <div className="mt-6">
                      <Button variant="outline" size="md" onClick={handleBack}>
                        Back
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Review Document */}
            {currentStep === 3 && uploadedFile && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <Card.Body>
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                      Review your document
                    </h2>

                    {/* Success Message */}
                    {uploadSuccess && (
                      <div className="mb-6">
                        <Alert
                          variant="success"
                          title="Document uploaded successfully"
                          description={`Your ${selectedDocument.name} has been uploaded. Verification has not started yet.`}
                        />
                      </div>
                    )}

                    {/* Error Message */}
                    {uploadError && (
                      <div className="mb-6">
                        <Alert
                          variant="error"
                          title="Upload failed"
                          description={uploadError}
                          dismissible
                          onDismiss={() => setUploadError(null)}
                        />
                      </div>
                    )}

                    {/* File Preview */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      {filePreview ? (
                        <div className="space-y-4">
                          <img
                            src={filePreview}
                            alt="Document preview"
                            className="max-w-full h-auto max-h-96 mx-auto rounded-lg border border-gray-200"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <FileCheck size={64} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              PDF Document Selected
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <FileText size={20} className="text-blue-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1 break-words">
                            {uploadedFile.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
                            <span>Type: {uploadedFile.type}</span>
                            <span>Size: {formatFileSize(uploadedFile.size)}</span>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveFile}
                          className="p-1 hover:bg-red-100 rounded transition-colors shrink-0"
                          aria-label="Remove file"
                          disabled={uploading}
                        >
                          <X size={20} className="text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Info Notice - Only show if not uploaded yet */}
                    {!uploadSuccess && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">
                              Ready to Upload
                            </p>
                            <p className="text-xs text-blue-700 leading-relaxed">
                              Review your document details above. Click "Continue" to upload your document to the backend for processing.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="md" 
                        onClick={handleBack}
                        disabled={uploading}
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleUpload}
                        disabled={uploading || uploadSuccess}
                        loading={uploading}
                      >
                        {uploading ? 'Uploading...' : uploadSuccess ? 'Uploaded' : 'Continue'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Verification Result */}
            {currentStep === 5 && verificationResult && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <Card.Body>
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle2 size={28} className="text-green-600" />
                      <div>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                          Verification result
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          Your document has been processed.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-[var(--color-text-secondary)]">Document type</p>
                        <p className="font-semibold text-[var(--color-text-primary)] capitalize">
                          {verificationResult.documentType || selectedDocument?.name || 'Unknown'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-[var(--color-text-secondary)]">Overall status</p>
                        <p className="font-semibold text-[var(--color-text-primary)] capitalize">
                          {(verificationResult.overallStatus || verificationResult.verificationStatus || 'Unknown').replaceAll('_', ' ')}
                        </p>
                      </div>
                    </div>

                    {(verificationResult.documentTypeMatch !== undefined || verificationResult.identityConsistency || verificationResult.tamperStatus) && (
                      <div className="mt-6">
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-3">
                          Verification checks
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {verificationResult.documentTypeMatch !== undefined && (
                            <div className="border border-[var(--color-border)] rounded-lg p-3">
                              <p className="text-xs text-[var(--color-text-secondary)]">Document type match</p>
                              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                {verificationResult.documentTypeMatch ? 'Passed' : 'Requires review'}
                              </p>
                            </div>
                          )}
                          {verificationResult.identityConsistency && (
                            <div className="border border-[var(--color-border)] rounded-lg p-3">
                              <p className="text-xs text-[var(--color-text-secondary)]">Identity consistency</p>
                              <p className="text-sm font-medium text-[var(--color-text-primary)] capitalize">
                                {verificationResult.identityConsistency.replaceAll('_', ' ')}
                              </p>
                            </div>
                          )}
                          {verificationResult.tamperStatus && (
                            <div className="border border-[var(--color-border)] rounded-lg p-3">
                              <p className="text-xs text-[var(--color-text-secondary)]">Tamper analysis</p>
                              <p className="text-sm font-medium text-[var(--color-text-primary)] capitalize">
                                {verificationResult.tamperStatus.replaceAll('_', ' ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {verificationResult.fieldValidation && (
                      <div className="mt-6">
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-3">
                          Field validation
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(verificationResult.fieldValidation).map(([field, isValid]) => (
                            <span key={field} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-[var(--color-text-secondary)] capitalize">
                              {field.replaceAll(/([A-Z])/g, ' $1')}: {isValid ? 'passed' : 'requires review'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {verificationResult.extractedFields && (
                      <div className="mt-6">
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-3">
                          Extracted information
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {Object.entries(verificationResult.extractedFields).map(([field, value]) => (
                            <div key={field} className="border border-[var(--color-border)] rounded-lg p-3">
                              <p className="text-xs text-[var(--color-text-secondary)] capitalize">{field.replaceAll(/([A-Z])/g, ' $1')}</p>
                              <p className="text-sm font-medium text-[var(--color-text-primary)] break-words">{value || 'Not detected'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button variant="outline" size="md" onClick={() => navigate('/verification-history')}>
                        View verification history
                      </Button>
                      <Button variant="primary" size="md" onClick={() => navigate('/documents')}>
                        View my documents
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--color-border)] shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-xs text-[var(--color-text-disabled)]">
            © {new Date().getFullYear()} DigiSetu · Powered by MOSIP
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VerifyIdentity;
