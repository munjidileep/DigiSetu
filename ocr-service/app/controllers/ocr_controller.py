from fastapi import UploadFile
from app.services.ocr_service import OCRService
from app.utils.image_utils import validate_image_file


class OCRController:
    def __init__(self):
        self.ocr_service = OCRService()

    async def process_ocr_request(self, file: UploadFile) -> dict:
        try:
            is_valid, error_message = validate_image_file(file.content_type)
            if not is_valid:
                return {
                    "success": False,
                    "message": error_message
                }

            extracted_text = self.ocr_service.extract_text_from_uploaded_file(file)
            return {
                "success": True,
                "text": extracted_text
            }

        except Exception as exc:
            return {
                "success": False,
                "message": f"Unable to process the file: {exc}"
            }
