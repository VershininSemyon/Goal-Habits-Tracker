
from db.repositories.goal import GoalRepository
from db.repositories.habit import HabitRepository
from db.repositories.progress_log import ProgressLogRepository
from db.repositories.user import UserRepository


class UnitOfWork:
    def __init__(self, session_factory):
        self.session_factory = session_factory

    async def __aenter__(self):
        self.session = self.session_factory()

        self.user_repository = UserRepository(self.session)
        self.goal_repository = GoalRepository(self.session)
        self.habit_repository = HabitRepository(self.session)
        self.progress_log_repository = ProgressLogRepository(self.session)

    async def __aexit__(self, exc_type, exc, tb):
        try:
            if exc_type is not None:
                await self.rollback()
        finally:
            await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()
