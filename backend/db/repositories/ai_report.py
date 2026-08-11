
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.repositories.base import BaseRepository
from models.ai_report import AIReportORM


class AIReportRepository(BaseRepository[AIReportORM]):
    def __init__(self, session: AsyncSession):
        super().__init__(AIReportORM, session)

    async def get_user_reports(self, user_id: str) -> list[AIReportORM]:
        stmt = select(AIReportORM).where(AIReportORM.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()
