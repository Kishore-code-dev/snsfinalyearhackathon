from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "XYLO AI Invoice Backend"
    API_V1_STR: str = "/api/v1"
    
    # AI settings
    OPENAI_API_KEY: str = "sk-mock-key-for-now"
    
    # Database
    SUPABASE_URL: str = "https://mock.supabase.co"
    SUPABASE_KEY: str = "mock-key"
    
    # Confidence Thresholds
    CONFIDENCE_THRESHOLD_APPROVED: float = 0.85
    CONFIDENCE_THRESHOLD_REVIEW: float = 0.50

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
