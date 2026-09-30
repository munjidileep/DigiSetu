from typing import Optional, Tuple


SUPPORTED_IMAGE_TYPES = {
    "image/png",
    "image/jpeg",
    "image/jpg",
}

SUPPORTED_DOCUMENT_TYPES = SUPPORTED_IMAGE_TYPES | {"application/pdf"}


def is_supported_image_type(content_type: Optional[str]) -> bool:
    return content_type in SUPPORTED_DOCUMENT_TYPES


def validate_image_file(content_type: Optional[str]) -> Tuple[bool, str]:
    if not is_supported_image_type(content_type):
        return False, "Unsupported file type. Please upload PNG, JPG, JPEG, or PDF files."
    return True, ""
