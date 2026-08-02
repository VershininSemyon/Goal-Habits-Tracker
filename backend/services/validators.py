

from exceptions.goal import GoalNotFoundError, GoalOwnershipError
from models.goal import GoalORM
from schemas.goal import GoalReadSchema


def validate_goal_ownership(goal: GoalORM | GoalReadSchema | None, user_id: str):
    if goal is None:
        raise GoalNotFoundError()

    if goal.user_id != user_id:
        raise GoalOwnershipError()
