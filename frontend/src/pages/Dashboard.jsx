
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
    getDashboardStats,
    getRecentActivity,
} from '../services/userService.js';

import { healthcheck } from '../services/healthService.js';
import { deleteGoal, getGoals } from '../services/goalService.js';

import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import GoalCard from '../components/GoalCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [goals, setGoals] = useState([]);
    const [serverHealthy, setServerHealthy] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);

        try {
            const [dashboardStats, recentActivity, userGoals, health] =
                await Promise.all([
                    getDashboardStats(),
                    getRecentActivity(6),
                    getGoals({
                        limit: 4,
                        offset: 0,
                        order_by: 'deadline',
                        order: 'asc',
                    }),
                    healthcheck(),
                ]);

            setStats(dashboardStats);
            setActivity(recentActivity);
            setGoals(userGoals);
            setServerHealthy(Boolean(health.health));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const bestHabitsByValue = useMemo(
        () => (stats?.best_habits_by_value || []).slice(0, 5),
        [stats]
    );

    const bestHabitsByCount = useMemo(
        () => (stats?.best_habits_by_count || []).slice(0, 5),
        [stats]
    );

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                        Добро пожаловать
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight">
                        Ваш прогресс
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-slate-500">
                        Главные показатели, лучшие привычки и ближайшие цели —
                        на одном экране.
                    </p>
                </div>

                <Link to="/goals">
                    <Button>+ Новая цель</Button>
                </Link>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <span
                        className={`h-2 w-2 rounded-full ${
                            serverHealthy
                                ? 'bg-emerald-500'
                                : 'bg-rose-500'
                        }`}
                    />

                    API {serverHealthy ? 'работает' : 'недоступен'}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-sm">↻</span>

                    <span>
                        Статистика обновляется каждые 12 часов с момента
                        запроса
                    </span>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Stat
                    label="Завершено целей"
                    value={`${formatPercent(stats?.goals_completed_percent)}%`}
                    icon="🎯"
                    description="Доля целей со статусом «завершена»"
                />

                <Stat
                    label="Макс. серия"
                    value={`${stats?.max_streak ?? 0} дн.`}
                    icon="🔥"
                    description="Самая длинная серия дней с активностью"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <BestHabitsCard
                    title="Лучшие привычки по значению"
                    description="По суммарному значению, полученному из всех логов"
                    icon="🏆"
                    habits={bestHabitsByValue}
                    valueLabel="суммарно"
                    emptyText="Пока нет привычек с записями прогресса."
                />

                <BestHabitsCard
                    title="Лучшие привычки по количеству логов"
                    description="По общему количеству записей прогресса"
                    icon="📈"
                    habits={bestHabitsByCount}
                    valueLabel="логов"
                    emptyText="Пока нет привычек с записями прогресса."
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="font-black">
                                Ближайшие цели
                            </h2>

                            <p className="text-xs text-slate-400">
                                Сортировка по дедлайну
                            </p>
                        </div>

                        <Link
                            to="/goals"
                            className="text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
                        >
                            Все цели →
                        </Link>
                    </div>

                    {goals.length ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {goals.map((goal) => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    onDelete={async (goalId) => {
                                        if (
                                            !window.confirm(
                                                'Удалить цель?'
                                            )
                                        ) {
                                            return;
                                        }

                                        await deleteGoal(goalId);
                                        await load();
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="Пока нет целей"
                            description="Создайте первую цель, чтобы начать отслеживание."
                            action={
                                <Link to="/goals">
                                    <Button>Создать цель</Button>
                                </Link>
                            }
                        />
                    )}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <h2 className="font-black">
                            Последняя активность
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Последние записи прогресса
                        </p>
                    </div>

                    <div className="mt-5 space-y-3">
                        {activity.length ? (
                            activity.map((item, index) => (
                                <div
                                    key={`${item}-${index}`}
                                    className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600"
                                >
                                    <span className="mr-2 font-bold text-indigo-500">
                                        {index + 1}
                                    </span>

                                    {item || 'Запись без заметки'}
                                </div>
                            ))
                        ) : (
                            <p className="py-8 text-center text-sm text-slate-400">
                                Активности пока нет.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function Stat({ label, value, icon, description }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <span className="text-2xl">{icon}</span>

                <span className="text-2xl font-black text-slate-900">
                    {value}
                </span>
            </div>

            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {description}
            </p>
        </div>
    );
}

function BestHabitsCard({
    title,
    description,
    icon,
    habits,
    valueLabel,
    emptyText,
}) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>

                        <h2 className="font-black">{title}</h2>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {description}
                    </p>
                </div>

                <span className="hidden rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 sm:block">
                    Топ-5
                </span>
            </div>

            <div className="mt-5 space-y-3">
                {habits.length ? (
                    habits.map((habit, index) => (
                        <div
                            key={`${habit.goal_title}-${habit.habit_title}-${index}`}
                            className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-black text-indigo-600 shadow-sm">
                                {index + 1}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-slate-800">
                                    {habit.habit_title}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-slate-400">
                                    {habit.goal_title}
                                </p>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-sm font-black text-slate-900">
                                    {formatNumber(habit.value)}
                                </p>

                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    {valueLabel}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="py-8 text-center text-sm text-slate-400">
                        {emptyText}
                    </p>
                )}
            </div>
        </section>
    );
}

function formatPercent(value) {
    const numericValue = Number(value ?? 0);

    if (!Number.isFinite(numericValue)) {
        return '0';
    }

    return Number.isInteger(numericValue)
        ? numericValue
        : numericValue.toFixed(1);
}

function formatNumber(value) {
    const numericValue = Number(value ?? 0);

    if (!Number.isFinite(numericValue)) {
        return '0';
    }

    return new Intl.NumberFormat('ru-RU').format(numericValue);
}
