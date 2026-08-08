
from db.unitofwork import UnitOfWork
from schemas.progress_log import ProgressLogCreateSchema, ProgressLogReadSchema, ProgressLogUpdateSchema
from services.validators import validate_habit_ownership, validate_progress_log_ownership


class ProgressLogService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    async def create_progress_log(self,
        user_id: str,
        goal_id: str,
        habit_id: str,
        data: ProgressLogCreateSchema
    ) -> ProgressLogReadSchema:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            habit = await self.uow.habit_repository.get_by_id(habit_id)
            validate_habit_ownership(habit, goal, user_id)

            progress_log = await self.uow.progress_log_repository.create({
                "habit_id": habit_id,
                **data.model_dump()
            })
            await self.uow.commit()

        return ProgressLogReadSchema.model_validate(progress_log)

    async def get_habit_progress_logs(self,
        user_id: str,
        goal_id: str,
        habit_id: str
    ) -> list[ProgressLogReadSchema]:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            habit = await self.uow.habit_repository.get_by_id(habit_id)
            validate_habit_ownership(habit, goal, user_id)

            progress_logs = await self.uow.progress_log_repository.get_habit_progress_logs(habit_id)
            return [ProgressLogReadSchema.model_validate(progress_log) for progress_log in progress_logs]

    async def get_progress_log_by_id(self,
        user_id: str,
        goal_id: str,
        habit_id: str,
        progress_log_id: str
    ) -> ProgressLogReadSchema:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            habit = await self.uow.habit_repository.get_by_id(habit_id)
            progress_log = await self.uow.progress_log_repository.get_by_id(progress_log_id)
            validate_progress_log_ownership(progress_log, habit, goal, user_id)

            return ProgressLogReadSchema.model_validate(progress_log)

    async def delete_progress_log(self,
        user_id: str,
        goal_id: str,
        habit_id: str,
        progress_log_id: str
    ) -> None:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            habit = await self.uow.habit_repository.get_by_id(habit_id)
            progress_log = await self.uow.progress_log_repository.get_by_id(progress_log_id)
            validate_progress_log_ownership(progress_log, habit, goal, user_id)

            await self.uow.progress_log_repository.delete(progress_log_id)
            await self.uow.commit()

    async def update_progress_log(self,
        user_id: str,
        goal_id: str,
        habit_id: str,
        progress_log_id: str,
        data: ProgressLogUpdateSchema
    ) -> ProgressLogReadSchema:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            habit = await self.uow.habit_repository.get_by_id(habit_id)
            progress_log = await self.uow.progress_log_repository.get_by_id(progress_log_id)
            validate_progress_log_ownership(progress_log, habit, goal, user_id)

            updated_progress_log = await self.uow.progress_log_repository.update(
                progress_log_id,
                data.model_dump()
            )
            await self.uow.commit()

        return ProgressLogReadSchema.model_validate(updated_progress_log)
