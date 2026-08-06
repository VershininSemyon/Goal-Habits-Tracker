
import enum


class GoalStatusEnum(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class GoalSortFieldEnum(str, enum.Enum):
    CREATED_AT = "created_at"
    DEADLINE = "deadline"
