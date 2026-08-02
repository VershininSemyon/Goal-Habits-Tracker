
from exceptions.base import AppError


class GoalError(AppError):
    status_code: int = 400
    detail: str = "Ошибка цели"


class TitleAlreadyExistsError(GoalError):
    status_code: int = 400
    detail: str = "Цель с таким названием уже существует"


class GoalOwnershipError(GoalError):
    status_code: int = 403
    detail: str = "Вы не являетесь владельцем этой цели"


class GoalNotFoundError(GoalError):
    status_code: int = 404
    detail: str = "Цель не найдена"
