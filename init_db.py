import asyncio
from database import engine, Base
from models import DailyLog  # import your new combined model

async def init():
    async with engine.begin() as conn:
        # This will create all tables defined under Base (including DailyLog)
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init())
