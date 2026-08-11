
from exceptions.base import AppError


class AIReportError(AppError):
    status_code: int = 400
    detail: str = "Ошибка отчёта ии"


class AIReportOwnershipError(AIReportError):
    status_code: int = 403
    detail: str = "Вы не являетесь владельцем этого отчёта"


class AIReportNotFoundError(AIReportError):
    status_code: int = 404
    detail: str = "Отчёт ии не найден"
