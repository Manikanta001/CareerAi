import logging
from uuid import uuid4
from fastapi import Request, status
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

async def custom_exception_handler(request: Request, exc: Exception):
    request_id = str(uuid4())
    logger.error("Unhandled exception request_id=%s path=%s", request_id, request.url.path, exc_info=exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected internal server error occurred",
            "error": "Internal server error",
            "request_id": request_id,
        },
    )
