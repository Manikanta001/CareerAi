import re

def validate_email(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email))

def validate_file_extension(filename: str | None, allowed_extensions=None) -> bool:
    if not filename or "." not in filename:
        return False
    allowed_extensions = allowed_extensions or {"pdf", "docx"}
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in allowed_extensions
