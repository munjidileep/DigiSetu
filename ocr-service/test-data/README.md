# Test Data Folder

This folder is for storing test images that will be used to test the OCR functionality.

## Purpose

The OCR test program (`app/ocr_test.py`) looks for a test image in this folder to verify that text extraction works correctly.

## How to Use

1. **Find a test image:** Choose an image that contains text. This could be:
   - A screenshot of a document
   - A photo of a printed page
   - A scanned document
   - Any image with clear, readable text

2. **Place the image here:** Copy your test image into this `test-data` folder

3. **Rename it to `sample.png`:** The test program looks for a file named `sample.png`
   - If you have a JPG/JPEG file, you can either:
     - Rename it to `sample.png` (it will still work even with JPG content)
     - Or update the filename in `app/ocr_test.py` line 30

## Supported Image Formats

- PNG (recommended)
- JPG / JPEG
- Other formats supported by Pillow

## Tips for Good OCR Results

For best text extraction results, use images with:
- ✅ Clear, high-resolution text
- ✅ Good contrast (dark text on light background)
- ✅ Horizontal, upright text
- ✅ Standard fonts (not handwritten)

Avoid:
- ❌ Blurry or low-resolution images
- ❌ Rotated or skewed text
- ❌ Decorative or stylized fonts
- ❌ Handwritten text (works poorly with standard Tesseract)

## Example

After placing your test image:

```
test-data/
└── sample.png  ← Your test image goes here
```

Then run the OCR test:

```bash
cd ocr-service
python app/ocr_test.py
```

## What Happens Next

The test program will:
1. Check if `sample.png` exists
2. Open the image using Pillow
3. Extract text using Tesseract OCR
4. Print the extracted text to the terminal

This confirms that the OCR setup is working before we build the full service.
