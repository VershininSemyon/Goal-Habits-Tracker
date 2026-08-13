import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getGoal,
    updateGoal,
    deleteGoal,
    requestGoalAdvice,
} from "../services/goalService.js";
import {
    getHabits,
    getHabit,
    createHabit,
    updateHabit,
    deleteHabit,
} from "../services/habitService.js";
import {
    getProgressLogs,
    getProgressLog,
    createProgressLog,
    updateProgressLog,
    deleteProgressLog,
} from "../services/progressLogService.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import HabitCard from "../components/HabitCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const blankHabit = { title: "", frequency: "daily", target_time: "1" };
const blankLog = { notes: "", value_achieved: 1 };
const blankGoal = {
    title: "",
    description: "",
    deadline: "",
    status: "in_progress",
};

export default function GoalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [goal, setGoal] = useState(null);
    const [habits, setHabits] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [goalEdit, setGoalEdit] = useState(false);
    const [habitModal, setHabitModal] = useState(false);
    const [logModal, setLogModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [editingLog, setEditingLog] = useState(null);
    const [goalForm, setGoalForm] = useState(blankGoal);
    const [habitForm, setHabitForm] = useState(blankHabit);
    const [logForm, setLogForm] = useState(blankLog);
    const [saving, setSaving] = useState(false);
    const [adviceLoading, setAdviceLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const [g, h] = await Promise.all([getGoal(id), getHabits(id)]);
            setGoal(g);
            setGoalForm({
                title: g.title,
                description: g.description || "",
                deadline: toLocalInput(g.deadline),
                status: g.status,
            });
            setHabits(h);
            if (selectedHabit)
                setLogs(await getProgressLogs(id, selectedHabit.id));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, [id]);
    const selectHabit = async (habit) => {
        const freshHabit = await getHabit(id, habit.id);
        setSelectedHabit(freshHabit);
        setLogs(await getProgressLogs(id, freshHabit.id));
    };
    const saveGoal = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await updateGoal(id, {
                ...goalForm,
                description: goalForm.description || null,
                deadline: new Date(goalForm.deadline).toISOString(),
            });
            setGoal(updated);
            setGoalEdit(false);
        } finally {
            setSaving(false);
        }
    };
    const saveHabit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingHabit) await updateHabit(id, editingHabit.id, habitForm);
            else await createHabit(id, habitForm);
            setHabitModal(false);
            setEditingHabit(null);
            setHabitForm(blankHabit);
            await load();
        } finally {
            setSaving(false);
        }
    };
    const removeHabit = async (habitId) => {
        if (!window.confirm("Удалить привычку и её прогресс?")) return;
        await deleteHabit(id, habitId);
        if (selectedHabit?.id === habitId) {
            setSelectedHabit(null);
            setLogs([]);
        }
        await load();
    };
    const saveLog = async (e) => {
        e.preventDefault();
        if (!selectedHabit) return;
        setSaving(true);
        try {
            const data = {
                notes: logForm.notes || null,
                value_achieved: Number(logForm.value_achieved),
            };
            if (editingLog)
                await updateProgressLog(
                    id,
                    selectedHabit.id,
                    editingLog.id,
                    data,
                );
            else await createProgressLog(id, selectedHabit.id, data);
            setLogModal(false);
            setEditingLog(null);
            setLogForm(blankLog);
            await selectHabit(selectedHabit);
        } finally {
            setSaving(false);
        }
    };
    const removeLog = async (logId) => {
        if (!window.confirm("Удалить запись прогресса?")) return;
        await deleteProgressLog(id, selectedHabit.id, logId);
        await selectHabit(selectedHabit);
    };
    const generate = async () => {
        setAdviceLoading(true);
        try {
            await requestGoalAdvice(id);
            window.dispatchEvent(
                new CustomEvent("showToast", {
                    detail: {
                        message:
                            "AI начал генерацию привычек. Список обновится автоматически.",
                        type: "success",
                    },
                }),
            );
            setTimeout(load, 3000);
        } finally {
            setAdviceLoading(false);
        }
    };
    const removeGoal = async () => {
        if (!window.confirm("Удалить цель?")) return;
        await deleteGoal(id);
        navigate("/goals");
    };
    const openHabit = (habit) => {
        setEditingHabit(habit);
        setHabitForm({
            title: habit.title,
            frequency: habit.frequency,
            target_time: habit.target_time,
        });
        setHabitModal(true);
    };
    const openLog = async (log = null) => {
        const freshLog =
            log && selectedHabit
                ? await getProgressLog(id, selectedHabit.id, log.id)
                : null;
        setEditingLog(freshLog);
        setLogForm(
            freshLog
                ? {
                      notes: freshLog.notes || "",
                      value_achieved: freshLog.value_achieved,
                  }
                : blankLog,
        );
        setLogModal(true);
    };
    if (loading) return <Spinner />;
    if (!goal) return null;
    return (
        <div className="space-y-6">
            <Link to="/goals" className="text-sm font-bold text-indigo-600">
                ← Все цели
            </Link>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                    <div className="max-w-3xl">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                            {goal.status === "in_progress"
                                ? "В процессе"
                                : goal.status === "completed"
                                  ? "Завершена"
                                  : "Архив"}
                        </span>
                        <h1 className="mt-3 text-3xl font-black tracking-tight">
                            {goal.title}
                        </h1>
                        <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                            {goal.description || "Без описания"}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                            <span className="rounded-xl bg-slate-50 px-3 py-2">
                                ⏳{" "}
                                {new Date(goal.deadline).toLocaleString(
                                    "ru-RU",
                                )}
                            </span>
                            <span className="rounded-xl bg-slate-50 px-3 py-2">
                                Создана{" "}
                                {new Date(goal.created_at).toLocaleDateString(
                                    "ru-RU",
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => setGoalEdit(true)}
                        >
                            Редактировать
                        </Button>
                        <Button loading={adviceLoading} onClick={generate}>
                            ✦ AI-привычки
                        </Button>
                        <Button variant="danger" onClick={removeGoal}>
                            Удалить
                        </Button>
                    </div>
                </div>
            </section>
            <section className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black">Привычки</h2>
                            <p className="text-xs text-slate-400">
                                {habits.length} привычек в цели
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setEditingHabit(null);
                                setHabitForm(blankHabit);
                                setHabitModal(true);
                            }}
                        >
                            + Добавить
                        </Button>
                    </div>
                    {habits.length ? (
                        <div className="space-y-3">
                            {habits.map((habit) => (
                                <div
                                    key={habit.id}
                                    onClick={() => selectHabit(habit)}
                                    className={`cursor-pointer rounded-2xl transition ${selectedHabit?.id === habit.id ? "ring-2 ring-indigo-500" : ""}`}
                                >
                                    <HabitCard
                                        habit={habit}
                                        onEdit={openHabit}
                                        onDelete={removeHabit}
                                        onProgress={(h) => {
                                            selectHabit(h);
                                            openLog();
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="🔁"
                            title="Привычек пока нет"
                            description="Добавьте привычку вручную или попросите AI предложить набор под вашу цель."
                        />
                    )}
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black">Прогресс</h2>
                            <p className="text-xs text-slate-400">
                                {selectedHabit
                                    ? selectedHabit.title
                                    : "Выберите привычку слева"}
                            </p>
                        </div>
                        {selectedHabit && (
                            <Button onClick={() => openLog()}>
                                + Записать
                            </Button>
                        )}
                    </div>
                    {selectedHabit ? (
                        <div className="space-y-3">
                            {logs.length ? (
                                logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-lg font-black text-indigo-700">
                                                    {log.value_achieved}
                                                </div>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    {log.notes || "Без заметки"}
                                                </p>
                                                <p className="mt-2 text-xs text-slate-400">
                                                    {new Date(
                                                        log.created_at,
                                                    ).toLocaleString("ru-RU")}
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    className="px-2 py-1 text-xs"
                                                    onClick={() => openLog(log)}
                                                >
                                                    Изменить
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="px-2 py-1 text-xs"
                                                    onClick={() =>
                                                        removeLog(log.id)
                                                    }
                                                >
                                                    Удалить
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState
                                    icon="📈"
                                    title="Записей пока нет"
                                    description="Добавьте первую запись, чтобы начать строить историю прогресса."
                                    action={
                                        <Button onClick={() => openLog()}>
                                            Записать прогресс
                                        </Button>
                                    }
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex min-h-80 items-center justify-center rounded-2xl bg-slate-50 text-center text-sm text-slate-400">
                            Выберите привычку, чтобы увидеть её логи.
                        </div>
                    )}
                </div>
            </section>
            <Modal
                open={goalEdit}
                onClose={() => setGoalEdit(false)}
                title="Редактировать цель"
            >
                <form onSubmit={saveGoal} className="space-y-4">
                    <Input
                        label="Название"
                        value={goalForm.title}
                        onChange={(e) =>
                            setGoalForm({ ...goalForm, title: e.target.value })
                        }
                        required
                    />
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold">
                            Описание
                        </label>
                        <textarea
                            className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                            value={goalForm.description}
                            onChange={(e) =>
                                setGoalForm({
                                    ...goalForm,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                    <Input
                        label="Дедлайн"
                        type="datetime-local"
                        value={goalForm.deadline}
                        onChange={(e) =>
                            setGoalForm({
                                ...goalForm,
                                deadline: e.target.value,
                            })
                        }
                        required
                    />
                    <Select
                        label="Статус"
                        value={goalForm.status}
                        onChange={(e) =>
                            setGoalForm({ ...goalForm, status: e.target.value })
                        }
                        options={[
                            ["in_progress", "В процессе"],
                            ["completed", "Завершена"],
                            ["archived", "Архив"],
                        ]}
                    />
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setGoalEdit(false)}
                        >
                            Отмена
                        </Button>
                        <Button loading={saving}>Сохранить</Button>
                    </div>
                </form>
            </Modal>
            <Modal
                open={habitModal}
                onClose={() => setHabitModal(false)}
                title={
                    editingHabit ? "Редактировать привычку" : "Новая привычка"
                }
            >
                <form onSubmit={saveHabit} className="space-y-4">
                    <Input
                        label="Название"
                        value={habitForm.title}
                        onChange={(e) =>
                            setHabitForm({
                                ...habitForm,
                                title: e.target.value,
                            })
                        }
                        required
                    />
                    <Select
                        label="Частота"
                        value={habitForm.frequency}
                        onChange={(e) =>
                            setHabitForm({
                                ...habitForm,
                                frequency: e.target.value,
                            })
                        }
                        options={[
                            ["daily", "Каждый день"],
                            ["weekly", "Каждую неделю"],
                        ]}
                    />
                    <Input
                        label="Целевое значение"
                        value={habitForm.target_time}
                        onChange={(e) =>
                            setHabitForm({
                                ...habitForm,
                                target_time: e.target.value,
                            })
                        }
                        required
                    />
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setHabitModal(false)}
                        >
                            Отмена
                        </Button>
                        <Button loading={saving}>Сохранить</Button>
                    </div>
                </form>
            </Modal>
            <Modal
                open={logModal}
                onClose={() => setLogModal(false)}
                title={
                    editingLog ? "Редактировать прогресс" : "Записать прогресс"
                }
            >
                <form onSubmit={saveLog} className="space-y-4">
                    <Input
                        label="Достигнуто"
                        type="number"
                        min="0"
                        value={logForm.value_achieved}
                        onChange={(e) =>
                            setLogForm({
                                ...logForm,
                                value_achieved: e.target.value,
                            })
                        }
                        required
                    />
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold">
                            Заметка
                        </label>
                        <textarea
                            className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                            value={logForm.notes}
                            onChange={(e) =>
                                setLogForm({
                                    ...logForm,
                                    notes: e.target.value,
                                })
                            }
                            placeholder="Что получилось сегодня?"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setLogModal(false)}
                        >
                            Отмена
                        </Button>
                        <Button loading={saving}>Сохранить</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
function Select({ label, options, ...props }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
                {label}
            </label>
            <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                {...props}
            >
                {options.map(([value, text]) => (
                    <option key={value} value={value}>
                        {text}
                    </option>
                ))}
            </select>
        </div>
    );
}
function toLocalInput(value) {
    const date = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
