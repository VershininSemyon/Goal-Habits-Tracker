
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.repositories.base import BaseRepository
from models.progress_log import ProgressLogORM


class ProgressLogRepository(BaseRepository[ProgressLogORM]):
    def __init__(self, session: AsyncSession):
        super().__init__(ProgressLogORM, session)

    async def get_habit_progress_logs(self, habit_id: str) -> list[ProgressLogORM]:
        query = select(ProgressLogORM).where(ProgressLogORM.habit_id == habit_id)
        result = await self.session.execute(query)
        return result.scalars().all()
