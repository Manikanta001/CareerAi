import os
import re
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text() + "\n"
        doc.close()
    except Exception as e:
        logger.error(f"Error reading PDF {file_path}: {e}")
    return text

def extract_text_from_docx(file_path: str) -> str:
    text = ""
    try:
        import docx
        doc = docx.Document(file_path)
        parts = [para.text for para in doc.paragraphs if para.text.strip()]
        for table in doc.tables:
            for row in table.rows:
                cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if cells:
                    parts.append(" | ".join(cells))
        text = "\n".join(parts)
    except Exception as e:
        logger.error(f"Error reading DOCX {file_path}: {e}")
    return text

def clean_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]
    text = "\n".join(lines)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


_SECTION_HEADINGS = {
    "education": re.compile(r"^(education|academic background|qualifications?)(\s*[:\-].*)?$", re.I),
    "skills": re.compile(r"^(technical skills|skills|technologies|tech stack)(\s*[:\-].*)?$", re.I),
    "projects": re.compile(r"^(academic projects|personal projects|projects)(\s*[:\-].*)?$", re.I),
    "experience": re.compile(r"^(work experience|professional experience|experience|employment|internships?)(\s*[:\-].*)?$", re.I),
    "certifications": re.compile(r"^(certifications?|courses|licenses)(\s*[:\-].*)?$", re.I),
    "achievements": re.compile(r"^(achievements?|awards?|honors?|leadership|extracurricular activities|volunteer experience)(\s*[:\-].*)?$", re.I),
}


def _section_heading(line: str):
    candidate = line.strip().strip("#* ")
    for key, pattern in _SECTION_HEADINGS.items():
        match = pattern.match(candidate)
        if match:
            remainder = re.sub(r"^\s*[:\-]\s*", "", match.group(2) or "").strip()
            return key, remainder
    return None, ""

def parse_resume_sections(raw_text: str) -> Dict[str, Any]:
    sections = {
        "contact": False,
        "education": [],
        "skills": [],
        "projects": [],
        "experience": [],
        "certifications": [],
        "achievements": []
    }

    # Contact info detection
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
    phone_match = re.search(r'(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}', raw_text)
    if email_match or phone_match:
        sections["contact"] = True

    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    active_section = None
    for line in lines:
        heading, inline_content = _section_heading(line)
        if heading:
            active_section = heading
            if inline_content and len(sections[active_section]) < 8:
                sections[active_section].append(inline_content[:300])
            continue
        if active_section:
            # Keep only verbatim resume lines and cap output for a concise report.
            if len(sections[active_section]) < 8:
                sections[active_section].append(line[:300])

    # A heading with no following text should not count as a populated section.
    # This also keeps the report honest when a resume could not be parsed well.

    return sections
