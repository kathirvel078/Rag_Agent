import os

ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"]

def validate_file_type(filename: str):
    extension = os.path.splitext(filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        return False

    return True