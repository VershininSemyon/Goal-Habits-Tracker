
import uuid
from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, Field, field_validator

from enums.common import SortOrderEnum
from enums.goal import GoalSortFieldEnum, GoalStatusEnum


def validate_deadline(deadline: datetime):
    now = datetime.now(deadline.tzinfo or timezone.utc)
    if deadline <= now:
        raise ValueError("Дедлайн должен быть в будущем")


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


class GoalQueryParams(BaseModel):
    text_query: str | None = None
    status_type: GoalStatusEnum | None = None
    order_by: GoalSortFieldEnum = GoalSortFieldEnum.CREATED_AT
    order: SortOrderEnum = SortOrderEnum.DESC
    limit: int = Field(default=10, ge=1, le=100)
    offset: int = Field(default=0, ge=0)
