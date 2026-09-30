from io import BytesIO

import fitz
from PIL import Image, ImageOps
import pytesseract


class OCRService:
    @staticmethod
    def prepare_image(image: Image.Image) -> Image.Image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        grayscale = ImageOps.grayscale(image)
        if grayscale.width < 1800:
            scale = 1800 / grayscale.width
            grayscale = grayscale.resize(
                (1800, max(1, round(grayscale.height * scale))),
                Image.Resampling.LANCZOS,
            )
        return ImageOps.autocontrast(grayscale)

    @staticmethod
    def run_tesseract(image: Image.Image) -> str:
        prepared_image = OCRService.prepare_image(image)
        return pytesseract.image_to_string(
            prepared_image,
            config="--oem 3 --psm 6",
        ).strip()

    @staticmethod
    def extract_text_from_image(image_bytes: bytes) -> str:
        image = Image.open(BytesIO(image_bytes))
        return OCRService.run_tesseract(image)

    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> str:
        document = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages_text = []

        try:
            for page_number in range(document.page_count):
                page = document[page_number]
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                image_bytes = pix.tobytes("png")
                image = Image.open(BytesIO(image_bytes))
                pages_text.append(OCRService.run_tesseract(image))
        finally:
            document.close()

        return "\n".join(part for part in pages_text if part)

    @staticmethod
    def extract_text_from_uploaded_file(file) -> str:
        file_bytes = file.file.read() if hasattr(file, "file") else file.read()
        if file.content_type == "application/pdf":
            return OCRService.extract_text_from_pdf(file_bytes)
        return OCRService.extract_text_from_image(file_bytes)
