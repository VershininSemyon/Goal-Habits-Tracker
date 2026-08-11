
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

    async def push_front(self, key: str, value: Any) -> None:
        await self.client.lpush(key, value)

    async def get_list(self, key: str, start: int, end: int) -> list:
        return await self.client.lrange(key, start, end)
