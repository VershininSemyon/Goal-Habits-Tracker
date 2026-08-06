
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.repositories.base import BaseRepository
from models.habit import HabitORM


class HabitRepository(BaseRepository[HabitORM]):
    def __init__(self, session: AsyncSession):
        super().__init__(HabitORM, session)

    async def get_goal_habits(self, goal_id: str) -> list[HabitORM]:
        stmt = select(HabitORM).where(HabitORM.goal_id == goal_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_goal_habit_by_title(self, title: str, goal_id: str) -> HabitORM:
        stmt = select(HabitORM).where(HabitORM.title == title, HabitORM.goal_id == goal_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()
