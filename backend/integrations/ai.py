
import json

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
            3. Целевое значение (target_time) должно быть измеримым (например: "30 минут", "10 страниц", "1 раз").

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

    def format_user_data_for_llm(self, raw_data: list) -> str:
        goals_dict = {}

        for row in raw_data:
            goal_title = row[0]
            goal_desc = row[1] or "Нет описания"
            goal_status = row[2]
            goal_deadline = str(row[3])

            habit_title = row[4]
            habit_freq = row[5]
            habit_target = row[6]
            log_notes = row[7] or "Без заметок"
            log_value = row[8]

            if goal_title not in goals_dict:
                goals_dict[goal_title] = {
                    "description": goal_desc,
                    "status": goal_status,
                    "deadline": goal_deadline,
                    "habits": {}
                }

            if habit_title not in goals_dict[goal_title]["habits"]:
                goals_dict[goal_title]["habits"][habit_title] = {
                    "frequency": habit_freq,
                    "target_time": habit_target,
                    "logs": []
                }

            goals_dict[goal_title]["habits"][habit_title]["logs"].append({
                "value_achieved": log_value,
                "notes": log_notes
            })

        return json.dumps(goals_dict, ensure_ascii=False, indent=2)

    def get_ai_report_prompt(
        self,
        start_date: str,
        end_date: str,
        formatted_data: str
    ) -> str:
        prompt = f"""Ты — профессиональный AI-коуч по продуктивности и достижению целей.
            Твоя задача: проанализировать данные о прогрессе пользователя за конкретную неделю и составить мотивирующий, структурированный еженедельный отчет.

            [ПЕРИОД ОТЧЕТА]
            С {start_date} по {end_date}

            [ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ЗА ЭТОТ ПЕРИОД]
            {formatted_data}

            [ТРЕБОВАНИЯ К ОТЧЕТУ]
            Проанализируй данные и верни ответ ИСКЛЮЧИТЕЛЬНО в формате Markdown со следующими разделами:

            1. 📊 **Общая сводка**: Краткая оценка прогресса за неделю (1-2 предложения).
            2. 🏆 **Главные победы**: Конкретные привычки или цели, где пользователь показал отличный результат или регулярность.
            3. ⚠️ **Зоны роста**: Привычки, которые проседали, были пропущены или остались без внимания. Будь конструктивен, не ругай, а предлагай решения.
            4. 💡 **Фокус на следующую неделю**: Один конкретный, выполнимый совет, основанный на данных (например, "Попробуй снизить целевое время для X, чтобы войти в ритм", или "Ты отлично справляешься с Y, попробуй добавить Z").

            [ПРАВИЛА ФОРМАТИРОВАНИЯ]
            - Используй эмодзи для визуальной структуры (как в заголовках выше).
            - Будь лаконичен, конкретен и мотивирующ. Избегай "воды" и общих фраз.
            - НЕ добавляй никаких вступлений вроде "Вот твой отчет:" или заключений. Начинай ответ сразу с раздела "📊 **Общая сводка**".
        """
        return prompt

    async def send_request_to_llm(self, prompt: str) -> str:
        async with self._client as client:
            response = await client.achat(prompt)
            return response.choices[0].message.content


llm_client = LlmApiClient(settings.LLM_API_KEY)
