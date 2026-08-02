
import uuid

from fastapi import APIRouter, status

from api.dependencies import CurrentUserDep, GoalServiceDep
from schemas.goal import GoalCreateSchema, GoalReadSchema, GoalUpdateSchema

goal_router = APIRouter(prefix="/goals", tags=["Goals"])

@goal_router.post(
    "/",
    response_model=GoalReadSchema,
    status_code=status.HTTP_201_CREATED
)
async def create_goal(
    data: GoalCreateSchema,
    user: CurrentUserDep,
    goal_service: GoalServiceDep
) -> GoalReadSchema:
    return await goal_service.create_goal(data, user.id)


@goal_router.get(
    "/",
    response_model=list[GoalReadSchema],
    status_code=status.HTTP_200_OK
)
async def get_goals(
    user: CurrentUserDep,
    goal_service: GoalServiceDep
) -> GoalReadSchema:
    return await goal_service.get_user_goals(user.id)


@goal_router.get(
    "/{goal_id}",
    response_model=GoalReadSchema,
    status_code=status.HTTP_200_OK
)
async def get_goal_by_id(
    goal_id: uuid.UUID,
    user: CurrentUserDep,
    goal_service: GoalServiceDep
) -> GoalReadSchema:
    return await goal_service.get_goal_by_id(user.id, goal_id)


@goal_router.delete(
    "/{goal_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_goal(
    goal_id: uuid.UUID,
    user: CurrentUserDep,
    goal_service: GoalServiceDep
):
    await goal_service.delete_goal(user.id, goal_id)


@goal_router.put(
    "/{goal_id}",
    response_model=GoalReadSchema,
    status_code=status.HTTP_200_OK
)
async def update_goal(
    goal_id: uuid.UUID,
    data: GoalUpdateSchema,
    user: CurrentUserDep,
    goal_service: GoalServiceDep
) -> GoalReadSchema:
    return await goal_service.update_goal(user.id, goal_id, data)
