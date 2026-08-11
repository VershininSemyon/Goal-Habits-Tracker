
from gigachat import GigaChatAsyncClient

from config.settings import settings


class LlmApiClient:
    def __init__(
        self,
        api_key: str,
        model: str = "GigaChat-2"
    ):
        self._model = model
        self._api_key = api_key

        self._client = GigaChatAsyncClient(
            credentials=self._api_key,
            model=model,
            scope="GIGACHAT_API_PERS",
            verify_ssl_certs=False
        )

    @property
    def model(self) -> str:
        return self._model

    def get_habits_generation_prompt(
        self,
        goal_title: str,
        goal_description: str | None,
        goal_deadline: str
    ) -> str:
        prompt = f"""Ты — эксперт по продуктивности и формированию привычек. 
            Твоя задача: разбить следующую цель пользователя на 3-5 конкретных, измеримых и выполнимых привычек.

            [ДАННЫЕ ЦЕЛИ]
            Название: {goal_title}
            Описание: {goal_description or 'Нет описания'}
            Дедлайн: {goal_deadline}

            [ПРАВИЛА ФОРМИРОВАНИЯ ПРИВЫЧЕК]
            1. Название привычки должно быть коротким, начинаться с глагола и быть конкретным действием (макс. 100 символов).
            2. Частота (frequency) должна быть строго либо "daily", либо "weekly".
            3. Целевое значение (target_value) должно быть измеримым (например: "30 минут", "10 страниц", "1 раз").

            [ТРЕБОВАНИЯ К ФОРМАТУ ОТВЕТА]
            Верни ответ ИСКЛЮЧИТЕЛЬНО в виде валидного JSON-массива объектов. 
            НЕ добавляй никаких вступлений, пояснений, извинений или markdown-оберток (таких как ```json). Только чистый JSON.

            Строгая схема ответа:
            [
            {{
                "title": "Название привычки",
                "frequency": "daily или weekly",
                "target_time": "Необходимое время (строка)"
            }}
            ]
        """
        return prompt

    async def send_request_to_llm(self, prompt: str) -> str:
        async with self._client as client:
            response = await client.achat(prompt)
            return response.choices[0].message.content


llm_client = LlmApiClient(settings.LLM_API_KEY)
