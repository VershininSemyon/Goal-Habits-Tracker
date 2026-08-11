
from db.unitofwork import UnitOfWork
from schemas.ai_report import AIReportCreateSchema, AIReportReadSchema


class AIReportService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    async def get_user_ai_reports(self, user_id: str) -> list[AIReportReadSchema]:
        async with self.uow:
            reports = await self.uow.ai_report_repository.get_user_reports(user_id)

        return [AIReportReadSchema.model_validate(report) for report in reports]
