from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_config = {"env_prefix": "SAD_FEN_"}

    host: str = "127.0.0.1"
    port: int = 8000
    debug: bool = False

    knowledge_base_path: Path = Path(
        "..", "conocimientos.pl"
    )

    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]


settings = Settings()
