from fastapi import APIRouter, HTTPException

from app.data.company_patterns import company_mock_test, get_company_pattern
from app.utils.helpers import success_response

router = APIRouter(prefix="/company-prep", tags=["Company Preparation"])


@router.get("/{company_slug}")
def get_company_prep(company_slug: str):
    pattern = get_company_pattern(company_slug)
    if pattern is None:
        raise HTTPException(status_code=404, detail="Company practice pattern not found")

    response = {key: value for key, value in pattern.items() if key != "questions"}
    response["practice_question_count"] = len(pattern["questions"])
    response["practice_test"] = company_mock_test(company_slug)
    response["content_notice"] = (
        "Practice questions are original and aligned to this pattern summary. "
        "They are not official or verified previous-year questions."
    )
    return success_response(response, "Company preparation guide retrieved")
