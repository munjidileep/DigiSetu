"""
Simple OCR Test Program

This program tests if Python can extract text from images using Tesseract OCR.
It's a standalone test to verify the OCR setup before building the full service.
"""

import os
from pathlib import Path

# Pillow (PIL) - Python Imaging Library
# Used to open, manipulate, and work with image files
from PIL import Image

# pytesseract - Python wrapper for Tesseract OCR engine
# Allows Python to communicate with the Tesseract OCR software
import pytesseract


def main():
    """
    Main function that runs the OCR test
    """
    print("=" * 60)
    print("DigiSetu OCR Test - Standalone Test")
    print("=" * 60)
    print()
    
    # Get the path to the test image
    # Path(__file__) gets the location of this Python file (ocr_test.py)
    # .parent goes up one level to the 'app' directory
    # .parent again goes up to the 'ocr-service' directory
    # / "test-data" / "sample.png" adds the path to the test image
    current_dir = Path(__file__).parent.parent
    test_image_path = current_dir / "test-data" / "sample.png"
    
    print(f"Looking for test image at: {test_image_path}")
    print()
    
    # Check if the test image exists
    if not test_image_path.exists():
        print("❌ ERROR: Test image not found!")
        print()
        print("Please follow these steps:")
        print("1. Go to the 'ocr-service/test-data' folder")
        print("2. Place a test image file there")
        print("3. Rename it to 'sample.png' (or update the filename in this script)")
        print()
        print("Supported formats: PNG, JPG, JPEG")
        print("Suggestion: Use a screenshot of text or a scanned document")
        return
    
    print("✓ Test image found!")
    print()
    
    try:
        # Step 1: Open the image using Pillow (PIL)
        # This loads the image file into memory so we can work with it
        print("Step 1: Opening image with Pillow...")
        image = Image.open(test_image_path)
        print(f"✓ Image opened successfully")
        print(f"  - Image size: {image.size[0]} x {image.size[1]} pixels")
        print(f"  - Image mode: {image.mode}")
        print()
        
        # Step 2: Extract text from the image using Tesseract OCR
        # image_to_string() sends the image to Tesseract and returns the extracted text
        print("Step 2: Extracting text with Tesseract OCR...")
        print("(This may take a few seconds...)")
        extracted_text = pytesseract.image_to_string(image)
        print("✓ OCR completed!")
        print()
        
        # Step 3: Display the extracted text
        print("=" * 60)
        print("EXTRACTED TEXT:")
        print("=" * 60)
        
        if extracted_text.strip():
            # Text was found
            print(extracted_text)
        else:
            # No text was found (empty result)
            print("(No text detected in the image)")
            print()
            print("Possible reasons:")
            print("- Image might be too blurry or low quality")
            print("- Image might not contain any text")
            print("- Text might be in a non-standard font or handwritten")
        
        print("=" * 60)
        print()
        print("✅ OCR test completed successfully!")
        print()
        print("This confirms that:")
        print("- Python can import Pillow and pytesseract")
        print("- Tesseract OCR engine is working")
        print("- Images can be processed for text extraction")
        
    except pytesseract.TesseractNotFoundError:
        # This error occurs if Tesseract OCR is not installed or not in PATH
        print("❌ ERROR: Tesseract OCR not found!")
        print()
        print("Tesseract OCR must be installed on your system.")
        print("Please check that:")
        print("1. Tesseract is installed (you mentioned version 5.5.3)")
        print("2. Tesseract is in your system PATH")
        print("3. You can run 'tesseract --version' in your terminal")
        
    except Exception as e:
        # Catch any other unexpected errors
        print(f"❌ ERROR: An unexpected error occurred!")
        print(f"Error details: {e}")
        print()
        print("Please check:")
        print("- The image file is not corrupted")
        print("- The image format is supported (PNG, JPG, JPEG)")


if __name__ == "__main__":
    # This block runs when you execute this file directly
    # It won't run if this file is imported as a module
    main()
