
from exceptions.ai_report import AIReportNotFoundError, AIReportOwnershipError
from exceptions.goal import GoalNotFoundError, GoalOwnershipError
from exceptions.habit import HabitNotFoundError, HabitOwnershipError
from exceptions.progress_log import ProgressLogNotFoundError, ProgressLogOwnershipError
from models.ai_report import AIReportORM
from models.goal import GoalORM
from models.habit import HabitORM
from models.progress_log import ProgressLogORM


def validate_goal_ownership(goal: GoalORM | None, user_id: str):
    if goal is None:
        raise GoalNotFoundError()

    if goal.user_id != user_id:
        raise GoalOwnershipError()


def validate_habit_ownership(
    habit: HabitORM | None,
    goal: GoalORM | None,
    user_id: str
):
    validate_goal_ownership(goal, user_id)

    if habit is None:
        raise HabitNotFoundError()

    if habit.goal_id != goal.id:
        raise HabitOwnershipError()


def validate_progress_log_ownership(
    progress_log: ProgressLogORM | None,
    habit: HabitORM | None,
    goal: GoalORM | None,
    user_id: str
):
    validate_habit_ownership(habit, goal, user_id)

    if progress_log is None:
        raise ProgressLogNotFoundError()

    if progress_log.habit_id != habit.id:
        raise ProgressLogOwnershipError()


def validate_ai_report_ownership(ai_report: AIReportORM | None, user_id: str):
    if ai_report is None:
        raise AIReportNotFoundError()

    if ai_report.user_id != user_id:
        raise AIReportOwnershipError()
