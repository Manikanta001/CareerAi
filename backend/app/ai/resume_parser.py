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
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        logger.error(f"Error reading DOCX {file_path}: {e}")
    return text

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse_resume_sections(raw_text: str) -> Dict[str, Any]:
    text_lower = raw_text.lower()
    
    # Section keywords
    sections = {
        "contact": False,
        "education": [],
        "skills": [],
        "projects": [],
        "experience": [],
        "certifications": []
    }

    # Contact info detection
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
    phone_match = re.search(r'(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}', raw_text)
    if email_match or phone_match:
        sections["contact"] = True

    # Education detection
    edu_keywords = ["education", "b.tech", "b.e", "degree", "university", "college", "cgpa", "percentage", "bachelor", "master"]
    if any(k in text_lower for k in edu_keywords):
        sections["education"].append("Found education section/credentials")

    # Project keywords
    proj_keywords = ["project", "developed", "built", "implemented", "github", "system", "application"]
    if any(k in text_lower for k in proj_keywords):
        sections["projects"].append("Found project highlights")

    # Experience keywords
    exp_keywords = ["experience", "intern", "internship", "employment", "company", "role", "work"]
    if any(k in text_lower for k in exp_keywords):
        sections["experience"].append("Found work/internship experience")

    # Certification keywords
    cert_keywords = ["certificate", "certification", "certified", "course", "nptel", "coursera", "udemy"]
    if any(k in text_lower for k in cert_keywords):
        sections["certifications"].append("Found certifications")

    return sections
