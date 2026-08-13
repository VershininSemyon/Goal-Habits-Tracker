
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.repositories.base import BaseRepository
from models.goal import GoalORM
from models.habit import HabitORM
from models.progress_log import ProgressLogORM


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

    async def sort_habits_by_value(self, user_id: str) -> list:
        stmt = (
            select(
                GoalORM.title,
                HabitORM.title,
                func.sum(ProgressLogORM.value_achieved)
            )
            .select_from(HabitORM)
            .join(GoalORM, HabitORM.goal_id == GoalORM.id)
            .join(ProgressLogORM, ProgressLogORM.habit_id == HabitORM.id)
            .where(GoalORM.user_id == user_id)
            .group_by(GoalORM.title, HabitORM.title)
            .order_by(func.sum(ProgressLogORM.value_achieved).desc())
        )

        result = await self.session.execute(stmt)
        return result.all()

    async def sort_habits_by_logs_count(self, user_id: str) -> list:
        stmt = (
            select(
                GoalORM.title,
                HabitORM.title,
                func.count()
            )
            .select_from(HabitORM)
            .join(GoalORM, HabitORM.goal_id == GoalORM.id)
            .join(ProgressLogORM, ProgressLogORM.habit_id == HabitORM.id)
            .where(GoalORM.user_id == user_id)
            .group_by(GoalORM.title, HabitORM.title)
            .order_by(func.count().desc())
        )

        result = await self.session.execute(stmt)
        return result.all()
