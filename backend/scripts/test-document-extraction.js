import assert from 'node:assert/strict';
import { extractFieldsFromOcr, getExtractionStatuses } from '../src/utils/documentUtils.js';

const cases = [
  {
    type: 'pan',
    text: ['INCOME TAX DEPARTMENT', 'Name: DILEEP MUNJI', 'PAN: ABCDE1234F', 'Date of Birth: 10/05/2005', 'Issue Date: 01/01/2020'].join('\n'),
    expected: { name: 'DILEEP MUNJI', documentNumber: 'ABCDE1234F', dateOfBirth: '10/05/2005' }
  },
  {
    type: 'aadhaar',
    text: ['UIDAI', 'Name', 'DILEEP MUNJI', 'DOB: 10-05-2005', '1234 5678 9012', 'Address: 12 Main Street'].join('\n'),
    expected: { name: 'DILEEP MUNJI', documentNumber: '1234 5678 9012', dateOfBirth: '10/05/2005' }
  },
  {
    type: 'driving-licence',
    text: ['DRIVING LICENCE', 'Name: DILEEP MUNJI', 'DOB', '10.05.2005', 'Issue Date: 01/01/2020', 'Valid To: 01/01/2030', 'DL No: MH12 20201234567'].join('\n'),
    expected: { name: 'DILEEP MUNJI', dateOfBirth: '10/05/2005' }
  },
  {
    type: 'driving-licence',
    text: ['DRIVING LICENCE', 'Name: DILEEP MUNJI', 'Issue Date: 01/01/2020', 'Valid To: 01/01/2030'].join('\n'),
    expected: { name: 'DILEEP MUNJI', dateOfBirth: '' }
  }
];

for (const testCase of cases) {
  const fields = extractFieldsFromOcr(testCase.type, testCase.text);
  for (const [field, expectedValue] of Object.entries(testCase.expected)) {
    assert.equal(fields[field], expectedValue, `${testCase.type} ${field}`);
  }
  console.log(`${testCase.type}:`, JSON.stringify(fields), JSON.stringify(getExtractionStatuses(fields)));
}

console.log('Document extraction fixtures passed.');
