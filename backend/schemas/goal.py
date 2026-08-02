
import uuid
from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, ConfigDict, field_validator


def validate_deadline(deadline: datetime):
    now = datetime.now(deadline.tzinfo or timezone.utc)
    if deadline <= now:
        raise ValueError("Дедлайн должен быть в будущем")


class GoalStatusEnum(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class GoalReadSchema(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: str | None
    deadline: datetime
    status: GoalStatusEnum
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GoalCreateSchema(BaseModel):
    title: str
    description: str | None = None
    deadline: datetime
    status: GoalStatusEnum

    @field_validator("deadline")
    @classmethod
    def validate_deadline_in_future(cls, value: datetime) -> datetime:
        validate_deadline(value)
        return value


class GoalUpdateSchema(BaseModel):
    title: str
    description: str | None
    deadline: datetime
    status: GoalStatusEnum

    @field_validator("deadline")
    @classmethod
    def validate_deadline_in_future(cls, value: datetime) -> datetime:
        validate_deadline(value)
        return value
