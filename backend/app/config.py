from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str
    cors_origins: str = "http://localhost:3000"
    model_id: str = "dima806/facial_emotions_image_detection"
    jwt_secret: str = "change-this"
    jwt_expire_minutes: int = 10080

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
