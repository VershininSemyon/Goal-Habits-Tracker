
import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, field_validator


class AIReportReadSchema(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    week_start_date: date
    summary_text: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AIReportCreateSchema(BaseModel):
    week_start_date: date
    summary_text: str

    @field_validator("week_start_date")
    @classmethod
    def validate_week_start_date(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Дата начала недели не может быть в будущем")
        return value
