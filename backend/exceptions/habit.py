
from exceptions.base import AppError


class HabitError(AppError):
    status_code: int = 400
    detail: str = "Ошибка привычки"


class TitleAlreadyExistsError(HabitError):
    status_code: int = 400
    detail: str = "Привычка с таким названием уже существует"


class HabitOwnershipError(HabitError):
    status_code: int = 403
    detail: str = "Эта привычка не принадлежит этой цели"


class HabitNotFoundError(HabitError):
    status_code: int = 404
    detail: str = "Привычка не найдена"
