
import uuid

from fastapi import APIRouter, status

from api.dependencies import CurrentUserDep, HabitServiceDep
from schemas.habit import HabitCreateSchema, HabitReadSchema, HabitUpdateSchema

habit_router = APIRouter(prefix="/goals/{goal_id}/habits", tags=["Habits"])

@habit_router.post(
    "/",
    response_model=HabitReadSchema,
    status_code=status.HTTP_201_CREATED
)
async def create_habit(
    goal_id: uuid.UUID,
    data: HabitCreateSchema,
    user: CurrentUserDep,
    habit_service: HabitServiceDep
) -> HabitReadSchema:
    return await habit_service.create_habit(data, user.id, goal_id)


@habit_router.get(
    "/",
    response_model=list[HabitReadSchema],
    status_code=status.HTTP_200_OK
)
async def get_habits(
    goal_id: uuid.UUID,
    user: CurrentUserDep,
    habit_service: HabitServiceDep
) -> list[HabitReadSchema]:
    return await habit_service.get_goal_habits(user.id, goal_id)


@habit_router.get(
    "/{habit_id}",
    response_model=HabitReadSchema,
    status_code=status.HTTP_200_OK
)
async def get_habit_by_id(
    goal_id: uuid.UUID,
    habit_id: uuid.UUID,
    user: CurrentUserDep,
    habit_service: HabitServiceDep
) -> HabitReadSchema:
    return await habit_service.get_habit_by_id(user.id, goal_id, habit_id)


@habit_router.delete(
    "/{habit_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_habit(
    goal_id: uuid.UUID,
    habit_id: uuid.UUID,
    user: CurrentUserDep,
    habit_service: HabitServiceDep
):
    await habit_service.delete_habit(user.id, goal_id, habit_id)


@habit_router.put(
    "/{habit_id}",
    response_model=HabitReadSchema,
    status_code=status.HTTP_200_OK
)
async def update_habit(
    goal_id: uuid.UUID,
    habit_id: uuid.UUID,
    data: HabitUpdateSchema,
    user: CurrentUserDep,
    habit_service: HabitServiceDep
) -> HabitReadSchema:
    return await habit_service.update_habit(user.id, goal_id, habit_id, data)
