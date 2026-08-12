
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.repositories.base import BaseRepository
from models.goal import GoalORM
from models.habit import HabitORM
from models.progress_log import ProgressLogORM
from models.user import UserORM


class UserRepository(BaseRepository[UserORM]):
    def __init__(self, session: AsyncSession):
        super().__init__(UserORM, session)

    async def get_by_username(self, username: str) -> UserORM:
        stmt = select(UserORM).where(UserORM.username == username)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_email(self, email: str) -> UserORM:
        stmt = select(UserORM).where(UserORM.email == email)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_users_data(self, user_id: str) -> list:
        stmt = (
            select(
                GoalORM.title,
                GoalORM.description,
                GoalORM.status,
                GoalORM.deadline,
                HabitORM.title,
                HabitORM.frequency,
                HabitORM.target_time,
                ProgressLogORM.notes,
                ProgressLogORM.value_achieved
            )
            .select_from(GoalORM)
            .outerjoin(HabitORM, HabitORM.goal_id == GoalORM.id)
            .outerjoin(ProgressLogORM, ProgressLogORM.habit_id == HabitORM.id)
            .where(GoalORM.user_id == user_id)
        )

        result = await self.session.execute(stmt)
        return result.all()
