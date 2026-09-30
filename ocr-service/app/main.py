from fastapi import FastAPI
from app.routes import ocr_routes

app = FastAPI(
    title="DigiSetu OCR Service",
    description="OCR service for extracting text from images",
    version="1.0.0"
)


@app.get("/")
async def health_check():
    return {
        "success": True,
        "message": "DigiSetu OCR service is running"
    }


app.include_router(ocr_routes.router)
