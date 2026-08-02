
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.repositories.base import BaseRepository
from models.goal import GoalORM


class GoalRepository(BaseRepository[GoalORM]):
    def __init__(self, session: AsyncSession):
        super().__init__(GoalORM, session)

    async def get_by_title(self, title: str) -> GoalORM:
        stmt = select(GoalORM).where(GoalORM.title == title)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_user_goals(self, user_id: str) -> list[GoalORM]:
        stmt = select(GoalORM).where(GoalORM.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()
