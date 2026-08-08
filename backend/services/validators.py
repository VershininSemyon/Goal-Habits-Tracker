
from exceptions.goal import GoalNotFoundError, GoalOwnershipError
from exceptions.habit import HabitNotFoundError, HabitOwnershipError
from exceptions.progress_log import ProgressLogNotFoundError, ProgressLogOwnershipError
from models.goal import GoalORM
from models.habit import HabitORM
from models.progress_log import ProgressLogORM
from schemas.goal import GoalReadSchema
from schemas.habit import HabitReadSchema
from schemas.progress_log import ProgressLogReadSchema


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


def validate_progress_log_ownership(
    progress_log: ProgressLogORM | ProgressLogReadSchema | None,
    habit: HabitORM | None,
    goal: GoalORM | None,
    user_id: str
):
    validate_habit_ownership(habit, goal, user_id)

    if progress_log is None:
        raise ProgressLogNotFoundError()

    if progress_log.habit_id != habit.id:
        raise ProgressLogOwnershipError()
