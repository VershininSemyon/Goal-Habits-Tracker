
from db.unitofwork import UnitOfWork
from exceptions.habit import TitleAlreadyExistsError
from schemas.habit import HabitCreateSchema, HabitReadSchema, HabitUpdateSchema
from services.validators import validate_goal_ownership, validate_habit_ownership


class HabitService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    async def create_habit(self, data: HabitCreateSchema, user_id: str, goal_id: str) -> HabitReadSchema:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            validate_goal_ownership(goal, user_id)

            habit = await self.uow.habit_repository.get_goal_habit_by_title(data.title, goal_id)
            if habit is not None:
                raise TitleAlreadyExistsError()

            data = {
                **data.model_dump(),
                "goal_id": goal_id
            }

            created_habit = await self.uow.habit_repository.create(data)
            await self.uow.commit()

        return HabitReadSchema.model_validate(created_habit)

    async def get_goal_habits(self, user_id: str, goal_id: str) -> list[HabitReadSchema]:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            validate_goal_ownership(goal, user_id)

            habits = await self.uow.habit_repository.get_goal_habits(goal_id)
            return [HabitReadSchema.model_validate(habit) for habit in habits]

    async def get_habit_by_id(self, user_id: str, goal_id: str, habit_id: str) -> HabitReadSchema:
        async with self.uow:
            habit = await self.uow.habit_repository.get_by_id(habit_id)
            goal = await self.uow.goal_repository.get_by_id(goal_id)

            validate_habit_ownership(habit, goal, user_id)
            return HabitReadSchema.model_validate(habit)

    async def delete_habit(self, user_id: str, goal_id: str, habit_id: str) -> None:
        async with self.uow:
            habit = await self.uow.habit_repository.get_by_id(habit_id)
            goal = await self.uow.goal_repository.get_by_id(goal_id)

            validate_habit_ownership(habit, goal, user_id)

            await self.uow.habit_repository.delete(habit_id)
            await self.uow.commit()

    async def update_habit(self, user_id: str, goal_id: str, habit_id: str, data: HabitUpdateSchema) -> HabitReadSchema:
        async with self.uow:
            habit = await self.uow.habit_repository.get_by_id(habit_id)
            goal = await self.uow.goal_repository.get_by_id(goal_id)

            validate_habit_ownership(habit, goal, user_id)

            habit_by_title = await self.uow.habit_repository.get_goal_habit_by_title(data.title, goal_id)
            if habit_by_title is not None and habit_by_title.title != habit.title:
                raise TitleAlreadyExistsError()

            updated_habit = await self.uow.habit_repository.update(habit_id, data.model_dump())
            await self.uow.commit()

        return HabitReadSchema.model_validate(updated_habit)
