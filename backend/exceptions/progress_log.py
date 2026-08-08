
from exceptions.base import AppError


class ProgressLogError(AppError):
    status_code: int = 400
    detail: str = "Ошибка лога прогресса"


class ProgressLogOwnershipError(ProgressLogError):
    status_code: int = 403
    detail: str = "Этот лог не принадлежит этой привычке"


class ProgressLogNotFoundError(ProgressLogError):
    status_code: int = 404
    detail: str = "Лог не найден"
