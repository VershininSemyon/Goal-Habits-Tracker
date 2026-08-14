
import json
import logging
from datetime import date

from background.broker import broker
from db.database import async_session_factory
from db.unitofwork import UnitOfWork
from integrations.ai import llm_client


@broker.task
async def generate_habits_for_goal(
    goal_id: str,
    goal_title: str,
    goal_description: str | None,
    goal_deadline: str,
    habits: str
):
    prompt = llm_client.get_habits_generation_prompt(
        goal_title,
        goal_description,
        goal_deadline,
        habits
    )
    response = await llm_client.send_request_to_llm(prompt)

    habits = json.loads(response)
    habits = [{**habit, "goal_id": goal_id} for habit in habits]
    logging.info(f"Привычки: {habits}")

    uow = UnitOfWork(async_session_factory)
    async with uow:
        await uow.habit_repository.insert_many(habits)
        await uow.commit()


@broker.task
async def generate_ai_report(
    user_id: str,
    ai_report_id: str,
    start_date: date,
    end_date: date
):
    uow = UnitOfWork(async_session_factory)

    async with uow:
        raw_data = await uow.user_repository.get_users_data(user_id, start_date, end_date)

    formatted_data = llm_client.format_user_data_for_llm(raw_data)
    logging.info(f"Данные: {formatted_data}")

    prompt = llm_client.get_ai_report_prompt(
        start_date=start_date.strftime("%d.%m.%Y"),
        end_date=end_date.strftime("%d.%m.%Y"),
        formatted_data=formatted_data
    )

    try:
        report_text = await llm_client.send_request_to_llm(prompt)
        logging.info(f"Ответ: {report_text}")
        summary_text = report_text
    except Exception as e:
        logging.error(f"Ошибка при генерации отчета: {e}")
        summary_text = "Произошла ошибка"

    async with uow:
        await uow.ai_report_repository.update(ai_report_id, {"summary_text": summary_text})
        await uow.commit()
