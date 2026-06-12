from __future__ import annotations

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api.routes.ai import router as ai_router
from .api.routes.bookings import router as bookings_router
from .api.routes.cities import router as cities_router
from .api.routes.meta import router as meta_router
from .api.routes.places import router as places_router
from .api.routes.reviews import router as reviews_router
from .core.config import ALLOW_ORIGIN_REGEX, ALLOWED_ORIGINS, API_PREFIX, APP_NAME


def create_app() -> FastAPI:
    app = FastAPI(title=APP_NAME, version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_origin_regex=ALLOW_ORIGIN_REGEX,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        _: Request, exc: RequestValidationError
    ) -> JSONResponse:
        return JSONResponse(status_code=422, content={"detail": exc.errors()})

    @app.exception_handler(Exception)
    async def generic_exception_handler(_: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=500, content={"detail": "Internal server error"}
        )

    app.include_router(places_router, prefix=API_PREFIX)
    app.include_router(bookings_router, prefix=API_PREFIX)
    app.include_router(cities_router, prefix=API_PREFIX)
    app.include_router(meta_router, prefix=API_PREFIX)
    app.include_router(ai_router, prefix=API_PREFIX)
    app.include_router(reviews_router, prefix=API_PREFIX)

    @app.get("/")
    async def root() -> dict[str, str]:
        return {"status": "running", "service": APP_NAME}

    return app


app = create_app()
