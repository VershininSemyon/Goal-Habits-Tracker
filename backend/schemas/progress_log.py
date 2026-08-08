
import uuid
from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

ProgressLogValueAchieved = Annotated[int, Field(ge=0)]


class ProgressLogReadSchema(BaseModel):
    id: uuid.UUID
    habit_id: uuid.UUID
    notes: str | None
    value_achieved: ProgressLogValueAchieved
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProgressLogCreateSchema(BaseModel):
    notes: str | None = None
    value_achieved: ProgressLogValueAchieved


class ProgressLogUpdateSchema(BaseModel):
    notes: str | None
    value_achieved: ProgressLogValueAchieved
