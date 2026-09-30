import { processDocumentUpload } from '../services/documentProcessing.service.js';

export const processUploadedDocument = async (req, res) => {
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
      message: 'Document verification processed successfully',
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to process the document.'
    });
  }
};
