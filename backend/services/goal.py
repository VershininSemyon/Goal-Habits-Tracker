
from db.unitofwork import UnitOfWork
from exceptions.goal import TitleAlreadyExistsError
from schemas.goal import GoalCreateSchema, GoalQueryParams, GoalReadSchema, GoalUpdateSchema
from services.validators import validate_goal_ownership


class GoalService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    async def create_goal(self, data: GoalCreateSchema, user_id: str) -> GoalReadSchema:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_title(data.title)

            if goal is not None:
                raise TitleAlreadyExistsError()

            data = {
                **data.model_dump(),
                "user_id": user_id
            }

            created_goal = await self.uow.goal_repository.create(data)
            await self.uow.commit()

        return GoalReadSchema.model_validate(created_goal)

    async def get_user_goals(self, user_id: str, filters: GoalQueryParams) -> list[GoalReadSchema]:
        async with self.uow:
            goals = await self.uow.goal_repository.get_user_goals(
                user_id=user_id,
                **filters.model_dump()
            )
            return [GoalReadSchema.model_validate(goal) for goal in goals]

    async def get_goal_by_id(self, user_id: str, goal_id: str) -> GoalReadSchema:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            validate_goal_ownership(goal, user_id)
            return GoalReadSchema.model_validate(goal)

    async def delete_goal(self, user_id: str, goal_id: str) -> None:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            validate_goal_ownership(goal, user_id)

            await self.uow.goal_repository.delete(goal_id)
            await self.uow.commit()

    async def update_goal(self, user_id: str, goal_id: str, data: GoalUpdateSchema) -> GoalReadSchema:
        async with self.uow:
            goal = await self.uow.goal_repository.get_by_id(goal_id)
            validate_goal_ownership(goal, user_id)

            goal_by_title = await self.uow.goal_repository.get_by_title(data.title)
            if goal_by_title is not None and goal_by_title.title != goal.title:
                raise TitleAlreadyExistsError()

            updated_goal = await self.uow.goal_repository.update(goal_id, data.model_dump())
            await self.uow.commit()

        return GoalReadSchema.model_validate(updated_goal)
