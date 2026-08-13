
from sqlalchemy import asc, case, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.repositories.base import BaseRepository
from enums.common import SortOrderEnum
from enums.goal import GoalSortFieldEnum, GoalStatusEnum
from models.goal import GoalORM


class GoalRepository(BaseRepository[GoalORM]):
    def __init__(self, session: AsyncSession):
        super().__init__(GoalORM, session)

    async def get_user_goals(
        self,
        user_id: str,
        text_query: str | None = None,
        status_type: GoalStatusEnum | None = None,
        order_by: GoalSortFieldEnum = GoalSortFieldEnum.CREATED_AT,
        order: SortOrderEnum = SortOrderEnum.DESC,
        limit: int = 10,
        offset: int = 0
    ) -> list[GoalORM]:
        stmt = select(GoalORM).where(GoalORM.user_id == user_id)

        if text_query:
            stmt = stmt.where(
                or_(
                    GoalORM.title.contains(text_query),
                    GoalORM.description.contains(text_query)
                )
            )

        if status_type:
            stmt = stmt.where(
                GoalORM.status == status_type
            )

        sort_column = {
            GoalSortFieldEnum.CREATED_AT: GoalORM.created_at,
            GoalSortFieldEnum.DEADLINE: GoalORM.deadline
        }[order_by]

        if order == SortOrderEnum.DESC:
            stmt = stmt.order_by(desc(sort_column))
        else:
            stmt = stmt.order_by(asc(sort_column))

        stmt = stmt.limit(limit).offset(offset)

        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_by_title(self, title: str) -> GoalORM:
        stmt = select(GoalORM).where(GoalORM.title == title)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_goals_completed_percent(self, user_id: str) -> float:
        stmt = (
            select(
                func.count(case(
                    (GoalORM.status == GoalStatusEnum.COMPLETED, 1),
                    else_=None
                )) / func.nullif(func.count(), 0) * 100
            )
            .where(GoalORM.user_id == user_id)
        )

        result = await self.session.execute(stmt)
        value = result.scalar_one_or_none()
        return round(float(value), 2) if value is not None else 0.0
