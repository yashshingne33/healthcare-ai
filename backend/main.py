# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from contextlib import asynccontextmanager

# from database import connect_db
# from auth import router as auth_router
# from predict import router as predict_router
# from history import router as history_router


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     connect_db()
#     print("✓ Healthcare AI API is running")
#     yield


# app = FastAPI(
#     title="Healthcare AI API",
#     description="Multi-disease prediction system with explainable AI",
#     version="1.0.0",
#     lifespan=lifespan
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(auth_router)
# app.include_router(predict_router)
# app.include_router(history_router)

# @app.get("/health")
# async def health_check():
#     return {
#         "status":  "online",
#         "version": "1.0.0",
#         "models":  ["diabetes", "cancer", "heart"],
#     }









from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import connect_db
from auth import router as auth_router
from predict import router as predict_router
from history import router as history_router
from startup import ensure_models


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_models()
    connect_db()
    print("✓ Healthcare AI API is running")
    yield


app = FastAPI(
    title="Healthcare AI API",
    description="Multi-disease prediction system with explainable AI",
    version="1.0.0",
    lifespan=lifespan
)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://healthcare-ai-frontend-live.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(history_router)

@app.get("/health")
async def health_check():
    return {
        "status":  "online",
        "version": "1.0.0",
        "models":  ["diabetes", "cancer", "heart"],
    }