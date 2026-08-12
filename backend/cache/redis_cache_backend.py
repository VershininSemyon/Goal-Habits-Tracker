
from typing import Any

from redis import asyncio

from cache.redis_manager import redis_manager


class RedisCacheBackend:
    @property
    def client(self) -> asyncio.Redis:
        return redis_manager.client

    async def set_value(self, key: str, value: Any, ttl: int | None = None) -> None:
        await self.client.set(key, value, ex=ttl)

    async def increment(self, key: str) -> None:
        await self.client.incr(key)

    async def get_value(self, key: str) -> Any:
        return await self.client.get(key)

    async def ttl(self, key: str) -> int:
        return await self.client.ttl(key)

    async def hash_set(self, hash_key: str, key: str, value: Any) -> None:
        await self.client.hset(hash_key, key, value)

    async def hash_getall(self, hash_key: str) -> dict:
        return await self.client.hgetall(hash_key)

    async def hash_delete(self, hash_key: str, key: str) -> None:
        await self.client.hdel(hash_key, key)
