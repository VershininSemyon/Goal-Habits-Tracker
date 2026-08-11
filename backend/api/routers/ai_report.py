
import uuid

from fastapi import APIRouter, status

from api.dependencies import AIReportServiceDep, CurrentUserDep
from schemas.ai_report import AIReportCreateSchema, AIReportReadSchema

ai_report_router = APIRouter(prefix="/users/me", tags=["AI Reports"])

@ai_report_router.get(
    "/ai-reports",
    response_model=list[AIReportReadSchema],
    status_code=status.HTTP_200_OK
)
async def get_user_reports(
    current_user: CurrentUserDep,
    ai_report_service: AIReportServiceDep
) -> list[AIReportReadSchema]:
    return await ai_report_service.get_user_ai_reports(current_user.id)


@ai_report_router.get(
    "/ai-reports/{report_id}",
    response_model=AIReportReadSchema,
    status_code=status.HTTP_200_OK
)
async def get_user_report_by_id(
    report_id: uuid.UUID,
    current_user: CurrentUserDep,
    ai_report_service: AIReportServiceDep
) -> AIReportReadSchema:
    return await ai_report_service.get_ai_report_by_id(report_id, current_user.id)


@ai_report_router.delete(
    "/ai-reports/{report_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_user_report(
    report_id: uuid.UUID,
    current_user: CurrentUserDep,
    ai_report_service: AIReportServiceDep
):
    await ai_report_service.delete_ai_report(report_id, current_user.id)
