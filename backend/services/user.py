
from cache.redis_cache_backend import RedisCacheBackend
from db.unitofwork import UnitOfWork
from exceptions.user import EmailAlreadyExistsError, UsernameAlreadyExistsError
from integrations.hashing import hash_password
from schemas.user import UserCreateSchema, UserReadSchema, UserUpdateSchema


class UserService:
    def __init__(self, uow: UnitOfWork, cache: RedisCacheBackend):
        self.uow = uow
        self.cache = cache

    async def create_user(self, data: UserCreateSchema) -> UserReadSchema:
        async with self.uow:
            user = await self.uow.user_repository.get_by_username(data.username)
            if user is not None:
                raise UsernameAlreadyExistsError()

            user = await self.uow.user_repository.get_by_email(data.email)
            if user is not None:
                raise EmailAlreadyExistsError()

            user_dict = data.model_dump()
            user_dict['password'] = hash_password(user_dict['password'])

            created_user = await self.uow.user_repository.create(user_dict)
            await self.uow.commit()

        return UserReadSchema.model_validate(created_user)

    async def delete_user(self, user_id: str) -> None:
        async with self.uow:
            await self.uow.user_repository.delete(user_id)
            await self.uow.commit()

    async def change_user(self, current_user: UserReadSchema, data: UserUpdateSchema) -> UserReadSchema:
        async with self.uow:
            if current_user.username != data.username:
                user = await self.uow.user_repository.get_by_username(data.username)
                if user is not None:
                    raise UsernameAlreadyExistsError()

            if current_user.email != data.email:
                user = await self.uow.user_repository.get_by_email(data.email)
                if user is not None:
                    raise EmailAlreadyExistsError()

            updated_user = await self.uow.user_repository.update(current_user.id, data.model_dump())
            await self.uow.commit()

        return UserReadSchema.model_validate(updated_user)

    async def get_recent_activity(
        self,
        user_id: str,
        limit: int = 10,
    ) -> list[str]:
        recent_activity = await self.cache.hash_getall(f"user:{user_id}:recent_activity")
        return list(recent_activity.values())[:limit]
