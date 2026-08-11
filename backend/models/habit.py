
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.database import Base
from enums.habit import HabitFrequencyEnum


class HabitORM(Base):
    __tablename__ = 'habits'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    goal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("goals.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    frequency: Mapped[str] = mapped_column(Enum(HabitFrequencyEnum), nullable=False)
    target_time: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    goal: Mapped["GoalORM"] = relationship(back_populates="habits")
    progress_logs: Mapped[list["ProgressLogORM"]] = relationship(back_populates="habit")
