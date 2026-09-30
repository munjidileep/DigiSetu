export const allowedDocumentTypes = ['aadhaar', 'pan', 'driving-licence'];

export const allowedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

export const normalizeDocumentType = (documentType) => (
  typeof documentType === 'string' ? documentType.trim().toLowerCase() : ''
);

export const getFileHash = async (buffer) => {
  const crypto = await import('node:crypto');
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

export const isSupportedDocumentType = (documentType) => (
  allowedDocumentTypes.includes(normalizeDocumentType(documentType))
);

export const isSupportedMimeType = (mimeType) => allowedMimeTypes.includes(mimeType);

export const buildKeywordSet = (documentType) => {
  const keywordMap = {
    aadhaar: ['AADHAAR', 'UIDAI', 'UNIQUE IDENTIFICATION'],
    pan: ['PAN', 'PERMANENT ACCOUNT NUMBER', 'INCOME TAX'],
    'driving-licence': ['DRIVING LICENCE', 'DRIVING LICENSE', 'DL NO', 'LICENCE NO']
  };

  return keywordMap[documentType] || [];
};

export const normalizeName = (value = '') => value
  .replace(/\s+/g, ' ')
  .replace(/[^a-zA-Z\s]/g, '')
  .trim();

export const extractTextMatch = (sourceText, patterns = []) => {
  const text = String(sourceText || '').toUpperCase();
  for (const pattern of patterns) {
    if (text.includes(String(pattern).toUpperCase())) {
      return true;
    }
  }
  return false;
};

const datePattern = '(?:0?[1-9]|[12]\\d|3[01])\\s*[-/.]\\s*(?:0?[1-9]|1[0-2])\\s*[-/.]\\s*(?:19|20)\\d{2}';
const yearFirstDatePattern = '(?:19|20)\\d{2}\\s*[-/.]\\s*(?:0?[1-9]|1[0-2])\\s*[-/.]\\s*(?:0?[1-9]|[12]\\d|3[01])';
const dateRegex = new RegExp(`\\b(?:${datePattern}|${yearFirstDatePattern})\\b`, 'i');
const dateGlobalRegex = new RegExp(`\\b(?:${datePattern}|${yearFirstDatePattern})\\b`, 'gi');

const normalizeExtractedDate = (value) => String(value || '')
  .replace(/\s+/g, '')
  .replace(/[.-]/g, '/');

const cleanNameCandidate = (value) => String(value || '')
  .replace(/^(?:full\s+name|name)\s*[:.-]?\s*/i, '')
  .replace(/^(?:s\s*[/\.]?\s*o|d\s*[/\.]?\s*o|w\s*[/\.]?\s*o)\s*[:.-]?\s*/i, '')
  .replace(/[^a-zA-Z][^a-zA-Z' -].*$/, '')
  .replace(/\s+/g, ' ')
  .trim();

const isNameCandidate = (value) => {
  const normalized = cleanNameCandidate(value);
  if (normalized.length < 3 || /\d/.test(normalized)) return false;
  if (!/[a-zA-Z]/.test(normalized)) return false;
  if (/^(?:name|dob|date of birth|address|aadhaar|pan|permanent account number|driving licence|driving license|government|india|male|female)$/i.test(normalized)) return false;
  if (/(?:date\s+of\s+birth|dob|issue\s+date|expiry|valid\s+(?:from|to)|address|number|no\.?$)/i.test(normalized)) return false;
  return true;
};

const extractNameFromLines = (lines) => {
  const nameLabel = /(?:full\s+name|name)\s*[:.-]?/i;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!nameLabel.test(line)) continue;

    const inlineValue = line.replace(nameLabel, '').trim();
    if (isNameCandidate(inlineValue)) return cleanNameCandidate(inlineValue);

    for (let nextIndex = index + 1; nextIndex < Math.min(lines.length, index + 3); nextIndex += 1) {
      if (isNameCandidate(lines[nextIndex])) return cleanNameCandidate(lines[nextIndex]);
    }
  }

  return '';
};

const extractDateOfBirthFromLines = (documentType, lines) => {
  const birthLabel = /(?:date\s*of\s*birth|d\s*\.?\s*o\s*\.?\s*b|dob)\s*[:.-]?/i;
  const excludedDateLabel = /(?:issue\s*date|expiry|valid\s*(?:from|to)|date\s*of\s*issue)/i;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!birthLabel.test(line)) continue;
    const inlineMatch = line.match(dateRegex);
    if (inlineMatch) return normalizeExtractedDate(inlineMatch[0]);

    for (let nextIndex = index + 1; nextIndex < Math.min(lines.length, index + 3); nextIndex += 1) {
      const nearbyMatch = lines[nextIndex].match(dateRegex);
      if (nearbyMatch) return normalizeExtractedDate(nearbyMatch[0]);
    }
  }

  const candidates = lines
    .filter((line) => !excludedDateLabel.test(line))
    .flatMap((line) => line.match(dateGlobalRegex) || [])
    .map(normalizeExtractedDate);

  if (documentType === 'driving-licence' && candidates.length > 1) return '';
  return candidates[0] || '';
};

const extractDocumentNumberForType = (documentType, text) => {
  const patterns = {
    aadhaar: [/\b\d{4}\s*\d{4}\s*\d{4}\b/g],
    pan: [/\b[A-Z]{5}\s*\d{4}\s*[A-Z]\b/gi],
    'driving-licence': [/\b[A-Z]{2}\s*\d{2,4}\s*[A-Z]{0,2}\s*\d{4,6}\b/gi, /\b\d{15}\b/g]
  };

  for (const pattern of patterns[documentType] || []) {
    const match = String(text || '').match(pattern);
    if (match?.[0]) return match[0].replace(/\s+/g, ' ').trim();
  }
  return '';
};

export const extractFieldsFromOcr = (documentType, ocrText) => {
  const lines = String(ocrText || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const name = extractNameFromLines(lines);
  const dateOfBirth = extractDateOfBirthFromLines(documentType, lines);
  const address = documentType === 'pan'
    ? ''
    : lines.find((line) => /[A-Za-z]/.test(line) && /\d/.test(line) && !dateRegex.test(line)) || '';

  return {
    name,
    documentNumber: extractDocumentNumberForType(documentType, ocrText),
    dateOfBirth,
    address: address.trim()
  };
};

export const getExtractionStatuses = (fields) => Object.fromEntries(
  Object.entries(fields).map(([field, value]) => [field, {
    value,
    status: value ? 'extracted' : 'missing'
  }])
);

export const computeIdentityConsistency = (authName, extractedName) => {
  if (!authName && !extractedName) {
    return 'unavailable';
  }

  if (!authName || !extractedName) {
    return 'unavailable';
  }

  const userName = normalizeName(authName);
  const docName = normalizeName(extractedName);

  if (!userName || !docName) {
    return 'unavailable';
  }

  const userTokens = userName.toLowerCase().split(' ');
  const docTokens = docName.toLowerCase().split(' ');
  const sharedTokens = userTokens.filter((token) => docTokens.includes(token));

  if (sharedTokens.length >= 2 || userName.toLowerCase() === docName.toLowerCase()) {
    return 'matched';
  }

  if (sharedTokens.length >= 1) {
    return 'partially_matched';
  }

  return 'mismatch';
};
