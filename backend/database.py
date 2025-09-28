from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Async SQLite URL
DATABASE_URL = "sqlite+aiosqlite:///./health.db"

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
)

# Session factory
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Base class for models
Base = declarative_base()
