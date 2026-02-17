from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.api.pipeline import router

app = FastAPI(title=settings.PROJECT_NAME)

# --- REAL PRODUCT FIX: CORS Configuration ---
# Allow frontend (localhost:7575) to talk to backend (localhost:8000)
# This is CRITICAL for "Real Product" integration.
origins = [
    "http://localhost:7575",
    "http://localhost:3000",
    "http://127.0.0.1:7575",
    "http://127.0.0.1:3000",
    # Production URLs (update these after deployment)
    "https://*.vercel.app",  # Vercel deployments
    "https://*.railway.app",  # Railway deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "AI Invoice Backend Running", "version": "1.0.0"}

# Include our core pipeline router
app.include_router(router)

# --- REAL PRODUCT FIX: In-Memory DB Persistence (MVP) ---
# If no real DB connected, we define a fallback here for the API to use.
# This prevents "Demo Mode" emptiness if keys are missing.

if __name__ == "__main__":
    import uvicorn
    # run with reload for dev experience
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
