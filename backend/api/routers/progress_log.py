
import uuid

from fastapi import APIRouter, status

from api.dependencies import CurrentUserDep, ProgressLogServiceDep
from schemas.progress_log import ProgressLogCreateSchema, ProgressLogReadSchema, ProgressLogUpdateSchema

progress_log_router = APIRouter(prefix="/goals/{goal_id}/habits/{habit_id}/progress-logs", tags=["Progress Logs"])

@progress_log_router.post(
    "/",
    response_model=ProgressLogReadSchema,
    status_code=status.HTTP_201_CREATED
)
async def create_progress_log(
    goal_id: uuid.UUID,
    habit_id: uuid.UUID,
    data: ProgressLogCreateSchema,
    user: CurrentUserDep,
    progress_log_service: ProgressLogServiceDep
) -> ProgressLogReadSchema:
    return await progress_log_service.create_progress_log(
        user_id=user.id,
        goal_id=goal_id,
        habit_id=habit_id,
        data=data
    )


@progress_log_router.get(
    "/",
    response_model=list[ProgressLogReadSchema],
    status_code=status.HTTP_200_OK
)
async def get_habit_progress_logs(
    goal_id: uuid.UUID,
    habit_id: uuid.UUID,
    user: CurrentUserDep,
    progress_log_service: ProgressLogServiceDep
) -> list[ProgressLogReadSchema]:
    return await progress_log_service.get_habit_progress_logs(
        user_id=user.id,
        goal_id=goal_id,
        habit_id=habit_id
    )


@progress_log_router.get(
    "/{progress_log_id}",
    response_model=ProgressLogReadSchema,
    status_code=status.HTTP_200_OK
)
async def get_progress_log_by_id(
    goal_id: uuid.UUID,
    habit_id: uuid.UUID,
    progress_log_id: uuid.UUID,
    user: CurrentUserDep,
    progress_log_service: ProgressLogServiceDep
) -> ProgressLogReadSchema:
    return await progress_log_service.get_progress_log_by_id(
        user_id=user.id,
        goal_id=goal_id,
        habit_id=habit_id,
        progress_log_id=progress_log_id
    )


@progress_log_router.delete(
    "/{progress_log_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_progress_log(
    goal_id: uuid.UUID,
    habit_id: uuid.UUID,
    progress_log_id: uuid.UUID,
    user: CurrentUserDep,
    progress_log_service: ProgressLogServiceDep
) -> None:
    await progress_log_service.delete_progress_log(
        user_id=user.id,
        goal_id=goal_id,
        habit_id=habit_id,
        progress_log_id=progress_log_id
    )


@progress_log_router.put(
    "/{progress_log_id}",
    response_model=ProgressLogReadSchema,
    status_code=status.HTTP_200_OK
)
async def update_progress_log(
    goal_id: uuid.UUID,
    habit_id: uuid.UUID,
    progress_log_id: uuid.UUID,
    data: ProgressLogUpdateSchema,
    user: CurrentUserDep,
    progress_log_service: ProgressLogServiceDep
) -> ProgressLogReadSchema:
    return await progress_log_service.update_progress_log(
        user_id=user.id,
        goal_id=goal_id,
        habit_id=habit_id,
        progress_log_id=progress_log_id,
        data=data
    )
