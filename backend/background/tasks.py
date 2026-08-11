
import json

from background.broker import broker
from db.database import async_session_factory
from db.unitofwork import UnitOfWork
from integrations.ai import llm_client


@broker.task
async def generate_habits_for_goal(
    goal_id: str,
    goal_title: str,
    goal_description: str | None,
    goal_deadline: str
):
    prompt = llm_client.get_habits_generation_prompt(
        goal_title,
        goal_description,
        goal_deadline
    )
    response = await llm_client.send_request_to_llm(prompt)

    habits = json.loads(response)
    habits = [{**habit, "goal_id": goal_id} for habit in habits]

    uow = UnitOfWork(async_session_factory)
    async with uow:
        await uow.habit_repository.insert_many(habits)
        await uow.commit()
