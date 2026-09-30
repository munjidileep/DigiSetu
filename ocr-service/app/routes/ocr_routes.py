from fastapi import APIRouter, UploadFile, File
from app.controllers.ocr_controller import OCRController

router = APIRouter()
ocr_controller = OCRController()


@router.post("/ocr")
async def perform_ocr(file: UploadFile = File(...)):
    return await ocr_controller.process_ocr_request(file)
