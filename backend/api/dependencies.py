
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status

from cache.redis_cache_backend import RedisCacheBackend
from db.database import async_session_factory
from db.unitofwork import UnitOfWork
from schemas.user import UserReadSchema
from services.auth import AuthService
from services.goal import GoalService
from services.habit import HabitService
from services.user import UserService


def get_uow() -> UnitOfWork:
    return UnitOfWork(async_session_factory)

UOWDep = Annotated[UnitOfWork, Depends(get_uow)]

def get_redis_cache_backend() -> RedisCacheBackend:
    return RedisCacheBackend()

RedisCacheBackendDep = Annotated[RedisCacheBackend, Depends(get_redis_cache_backend)]

def get_user_service(uow: UOWDep) -> UserService:
    return UserService(uow)

UserServiceDep = Annotated[UserService, Depends(get_user_service)]

def get_auth_service(uow: UOWDep) -> AuthService:
    return AuthService(uow)

AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]

def get_goal_service(uow: UOWDep) -> GoalService:
    return GoalService(uow)

GoalServiceDep = Annotated[GoalService, Depends(get_goal_service)]

def get_habit_service(uow: UOWDep) -> HabitService:
    return HabitService(uow)

HabitServiceDep = Annotated[HabitService, Depends(get_habit_service)]


async def get_current_user(
    auth_service: AuthServiceDep,
    access_token: str | None = Cookie(default=None),
) -> UserReadSchema:
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не предоставлен access токен",
        )

    user = await auth_service.authenticate_user(access_token)
    return user

CurrentUserDep = Annotated[UserReadSchema, Depends(get_current_user)]
