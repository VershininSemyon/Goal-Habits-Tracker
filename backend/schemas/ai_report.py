
import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, model_validator


class AIReportReadSchema(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    start_date: date
    end_date: date
    summary_text: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AIReportCreateSchema(BaseModel):
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def validate_dates(self):
        current_date = date.today()

        if self.end_date > current_date:
            raise ValueError("Дата конца не может быть в будущем")

        if self.start_date > self.end_date:
            raise ValueError("Дата конца не может быть раньше даты начала")

        return self
