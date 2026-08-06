
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from enums.habit import HabitFrequencyEnum


class HabitReadSchema(BaseModel):
    id: uuid.UUID
    goal_id: uuid.UUID
    title: str
    frequency: HabitFrequencyEnum
    target_time: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HabitCreateSchema(BaseModel):
    title: str
    frequency: HabitFrequencyEnum
    target_time: str


class HabitUpdateSchema(BaseModel):
    title: str
    frequency: HabitFrequencyEnum
    target_time: str
