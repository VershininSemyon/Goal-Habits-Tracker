
from background.tasks import generate_ai_report
from db.unitofwork import UnitOfWork
from schemas.ai_report import AIReportCreateSchema, AIReportReadSchema
from services.validators import validate_ai_report_ownership


class AIReportService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    async def get_user_ai_reports(self, user_id: str) -> list[AIReportReadSchema]:
        async with self.uow:
            reports = await self.uow.ai_report_repository.get_user_reports(user_id)

        return [AIReportReadSchema.model_validate(report) for report in reports]

    async def create_ai_report(self, user_id: str, data: AIReportCreateSchema) -> AIReportReadSchema:
        async with self.uow:
            data = {
                **data.model_dump(),
                "user_id": user_id,
                "summary_text": "Генерация отчёта началась"
            }

            ai_report = await self.uow.ai_report_repository.create(data)
            await self.uow.commit()

        await generate_ai_report.kiq(user_id, ai_report.id, ai_report.start_date, ai_report.end_date)
        return AIReportReadSchema.model_validate(ai_report)

    async def get_ai_report_by_id(self, report_id: str, user_id: str) -> AIReportReadSchema:
        async with self.uow:
            report = await self.uow.ai_report_repository.get_by_id(report_id)

        validate_ai_report_ownership(report, user_id)
        return AIReportReadSchema.model_validate(report)

    async def delete_ai_report(self, report_id: str, user_id: str) -> None:
        async with self.uow:
            report = await self.uow.ai_report_repository.get_by_id(report_id)

            validate_ai_report_ownership(report, user_id)
            await self.uow.ai_report_repository.delete(report_id)
            await self.uow.commit()
