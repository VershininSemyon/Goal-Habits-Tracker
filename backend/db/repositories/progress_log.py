
from sqlalchemy import Date, Integer, cast, distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.repositories.base import BaseRepository
from models.goal import GoalORM
from models.habit import HabitORM
from models.progress_log import ProgressLogORM


class ProgressLogRepository(BaseRepository[ProgressLogORM]):
    def __init__(self, session: AsyncSession):
        super().__init__(ProgressLogORM, session)

    async def get_habit_progress_logs(self, habit_id: str) -> list[ProgressLogORM]:
        query = select(ProgressLogORM).where(ProgressLogORM.habit_id == habit_id)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_max_user_streak(self, user_id: str) -> int:
        dates_subq = (
            select(distinct(cast(ProgressLogORM.created_at, Date)).label("log_date"))
            .join(HabitORM, ProgressLogORM.habit_id == HabitORM.id)
            .join(GoalORM, HabitORM.goal_id == GoalORM.id)
            .where(GoalORM.user_id == user_id)
            .subquery("dates")
        )

        row_num = func.row_number().over(order_by=dates_subq.c.log_date)
        result_id = (dates_subq.c.log_date - cast(row_num, Integer)).label("result_id")

        result_subq = (
            select(dates_subq.c.log_date, result_id)
            .subquery("results")
        )

        streaks_subq = (
            select(
                result_subq.c.result_id,
                func.count().label("streak_length")
            )
            .select_from(result_subq)
            .group_by(result_subq.c.result_id)
            .subquery("streaks")
        )

        stmt = select(func.max(streaks_subq.c.streak_length))
        result = await self.session.execute(stmt)

        max_streak = result.scalar()
        return max_streak or 0
