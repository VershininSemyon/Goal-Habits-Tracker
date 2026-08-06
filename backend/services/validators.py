
from exceptions.goal import GoalNotFoundError, GoalOwnershipError
from exceptions.habit import HabitNotFoundError, HabitOwnershipError
from models.goal import GoalORM
from models.habit import HabitORM
from schemas.goal import GoalReadSchema
from schemas.habit import HabitReadSchema


def validate_goal_ownership(goal: GoalORM | GoalReadSchema | None, user_id: str):
    if goal is None:
        raise GoalNotFoundError()

    if goal.user_id != user_id:
        raise GoalOwnershipError()


def validate_habit_ownership(
    habit: HabitORM | HabitReadSchema | None,
    goal: GoalORM | None,
    user_id: str
):
    validate_goal_ownership(goal, user_id)

    if habit is None:
        raise HabitNotFoundError()

    if habit.goal_id != goal.id:
        raise HabitOwnershipError()
