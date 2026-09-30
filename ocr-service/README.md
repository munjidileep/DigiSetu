# DigiSetu OCR Service

## Overview

The DigiSetu OCR Service is a Python-based FastAPI microservice that extracts text from images using Tesseract OCR. This service is part of the larger DigiSetu identity verification platform and will eventually process identity documents like Aadhaar cards, PAN cards, and Driving Licences.

**Current Phase:** Phase 5E - FastAPI OCR API with Clean Layered Architecture

---

## What This Service Does

This FastAPI service accepts PNG, JPG, and JPEG images and extracts their text with Pillow and Tesseract OCR. Uploaded images are processed in memory and are not stored.

- **Accepts:** Image files (PNG, JPG, JPEG) via HTTP multipart upload
- **Processes:** Images using Tesseract OCR engine
- **Returns:** Extracted text as JSON response
- **Architecture:** Clean separation of concerns with Route → Controller → Service layers

---

## Project Structure

```
ocr-service/
├── app/
│   ├── __init__.py              # Main application package
│   ├── main.py                  # FastAPI app entry point
│   │
│   ├── routes/                  # API route definitions
│   │   ├── __init__.py
│   │   └── ocr_routes.py        # POST /ocr endpoint
│   │
│   ├── controllers/             # Request/response handling
│   │   ├── __init__.py
│   │   └── ocr_controller.py    # OCR request processing
│   │
│   ├── services/                # Business logic
│   │   ├── __init__.py
│   │   └── ocr_service.py       # Tesseract OCR operations
│   │
│   ├── utils/                   # Helper functions
│   │   ├── __init__.py
│   │   └── image_utils.py       # Image validation
│   │
│   └── ocr_test.py             # Standalone OCR test (Phase 5D)
│
├── test-data/                   # Test images for development
│   ├── sample.png
Python 3.10+
Tesseract OCR installed and available through the system PATH
Packages listed in `requirements.txt`: FastAPI, Uvicorn, python-multipart, pytesseract, and Pillow
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

---

## Layered Architecture
From the `ocr-service` directory, start the application later with:
The service follows a clean **MVC-style layered architecture** with clear separation of concerns:

### 1. Routes Layer (`app/routes/`)
**Responsibility:** Define API endpoints and HTTP request/response structure

- Maps URLs to controller functions
- Handles HTTP-specific details (request parsing, status codes)
- Does NOT contain business logic
- Example: `POST /ocr` → calls controller

### 2. Controllers Layer (`app/controllers/`)
**Responsibility:** Handle request/response logic

- Receives data from routes
- Performs request-level validation
- Calls service layer for business logic
- Formats responses for API clients
- Does NOT contain OCR implementation

### 3. Services Layer (`app/services/`)
**Responsibility:** Contain core business logic

- Implements actual OCR text extraction
- Uses Pillow and pytesseract
- Reusable across different parts of the application
- Independent of HTTP/API concerns

### 4. Utilities Layer (`app/utils/`)
**Responsibility:** Provide helper functions

- Image type validation
- File size checking
- Reusable utility functions
- No business logic

---

## Dependencies

### System Requirements

1. **Python 3.8+** (tested with Python 3.10.10)
2. **Tesseract OCR 5.5+** installed and in system PATH
3. **Virtual environment** (venv)

### Python Packages

Install all dependencies using:

```bash
pip install -r requirements.txt
```

**Required packages:**
- `fastapi` - Web framework for building APIs
- `uvicorn` - ASGI server for running FastAPI
- `python-multipart` - Required for file uploads
- `Pillow` - Image processing library
- `pytesseract` - Python wrapper for Tesseract OCR

---

## API Endpoints

### 1. Health Check

**Endpoint:** `GET /`

**Description:** Check if the service is running

**Request:** None

**Response:**
```json
{
  "success": true,
  "message": "DigiSetu OCR service is running"
}
```

**Example:**
```bash
curl http://localhost:8000/
```

---

### 2. Extract Text from Image

**Endpoint:** `POST /ocr`

**Description:** Extract text from an uploaded image using OCR

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file`: Image file (PNG, JPG, JPEG)

**Success Response:**
```json
{
  "success": true,
  "text": "Extracted text from the image will appear here"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Unable to process the image: error details"
}
```

**Example (using curl):**
```bash
curl -X POST http://localhost:8000/ocr \
  -F "file=@path/to/image.png"
```

**Example (using Python requests):**
```python
import requests

url = "http://localhost:8000/ocr"
files = {"file": open("image.png", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

---

## How to Run the Service

### Step 1: Activate Virtual Environment

**Windows PowerShell:**
```bash
cd ocr-service
.\venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**
```bash
cd ocr-service
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
cd ocr-service
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Start the API Server

**Option A: Using uvicorn directly**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Option B: Using Python**
```bash
python -m app.main
```

### Step 4: Access the API

- **API Base URL:** http://localhost:8000
- **Health Check:** http://localhost:8000/
- **OCR Endpoint:** http://localhost:8000/ocr
- **Auto-generated API Docs:** http://localhost:8000/docs
- **Alternative Docs:** http://localhost:8000/redoc

---

## Request Flow

Here's how a request flows through the application:

```
Client (HTTP Request)
    ↓
POST /ocr with image file
    ↓
[Routes Layer] ocr_routes.py
    - Receives HTTP request
    - Extracts uploaded file
    ↓
[Controller Layer] ocr_controller.py
    - Validates file type and size
    - Reads file contents
    ↓
[Service Layer] ocr_service.py
    - Opens image with Pillow
    - Extracts text with Tesseract
    - Returns extracted text
    ↓
[Controller Layer]
    - Formats response
    ↓
[Routes Layer]
    - Sends HTTP response
    ↓
Client (JSON Response)
```

---

## Validation Rules

The service validates uploaded files:

1. **File Type:** Must be PNG, JPG, or JPEG
2. **File Size:** Maximum 10 MB
3. **File Content:** Must not be empty

Invalid files will receive a clear error message.

---

## Error Handling

The service handles various error scenarios:

- **Invalid file type:** "Unsupported file type. Please upload PNG, JPG, or JPEG images."
- **File too large:** "File size exceeds maximum limit of 10 MB."
- **Empty file:** "Uploaded file is empty."
- **Tesseract not found:** "Tesseract OCR is not installed or not found in system PATH"
- **Processing error:** "Unable to process the image: [error details]"

---

## Current Limitations

**Phase 5E Scope:**
- ✅ Basic OCR text extraction
- ✅ File upload and validation
- ✅ Clean layered architecture
- ✅ Error handling

**Not Yet Implemented:**
- ❌ CORS configuration (will be added when connecting to frontend)
- ❌ Authentication (will be added in security phase)
- ❌ Connection to Node.js backend
- ❌ Document-specific parsing (Aadhaar/PAN/DL)
- ❌ MongoDB integration
- ❌ File storage/persistence
- ❌ ML-based validation
- ❌ Face verification
- ❌ Liveness detection

---

## Development Notes

### Why This Architecture?

**Separation of Concerns:**
- Routes handle HTTP
- Controllers handle request/response logic
- Services handle business logic
- Utilities provide helpers

**Benefits:**
- Easy to test each layer independently
- Easy to add new features
- Easy to understand for beginners
- Follows industry best practices

### In-Memory Processing

Files are processed in memory and not saved permanently. This is:
- Faster (no disk I/O)
- More secure (no file cleanup needed)
- Suitable for the current phase

Persistent storage will be added in future phases.

### Tesseract Configuration

The service uses Tesseract OCR from system PATH. No hardcoded paths are used, making it portable across different environments.

---

## Testing the API

### Using cURL

**Health check:**
```bash
curl http://localhost:8000/
```

**OCR extraction:**
```bash
curl -X POST http://localhost:8000/ocr \
  -F "file=@test-data/sample.png"
```

### Using FastAPI Docs

1. Start the server
2. Open http://localhost:8000/docs
3. Click on `POST /ocr`
4. Click "Try it out"
5. Upload an image
6. Click "Execute"
7. View the response

### Using Python

```python
import requests

# Test health endpoint
response = requests.get("http://localhost:8000/")
print(response.json())

# Test OCR endpoint
files = {"file": open("test-data/sample.png", "rb")}
response = requests.post("http://localhost:8000/ocr", files=files)
print(response.json())
```

---

## Next Steps

After Phase 5E is complete and tested:

1. **Phase 5F** - Connect to Node.js backend
2. **Phase 5G** - Implement Aadhaar parsing
3. **Phase 5H** - Implement PAN parsing
4. **Phase 5I** - Implement Driving Licence parsing
5. **Phase 6** - Add ML-based verification
6. **Phase 7** - Add face verification and liveness detection

---

## Troubleshooting

### Issue: Tesseract not found

**Error:** "Tesseract OCR is not installed or not found in system PATH"

**Solution:**
1. Verify Tesseract is installed: `tesseract --version`
2. Add Tesseract to system PATH if needed
3. Restart terminal after PATH changes

### Issue: Module not found

**Error:** "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
1. Activate virtual environment
2. Install dependencies: `pip install -r requirements.txt`

### Issue: Port already in use

**Error:** "Address already in use"

**Solution:**
1. Stop other services on port 8000
2. Or use a different port: `uvicorn app.main:app --port 8001`

---

## Summary

**What we have:**
- ✅ FastAPI application with clean architecture
- ✅ OCR text extraction endpoint
- ✅ File upload and validation
- ✅ Layered structure (Route → Controller → Service)
- ✅ Error handling
- ✅ In-memory image processing

**How to use:**
1. Activate virtual environment
2. Install dependencies
3. Start uvicorn server
4. Send POST requests to `/ocr` with image files
5. Receive extracted text as JSON

**Ready for:** Integration with Node.js backend and document-specific parsing in future phases.
