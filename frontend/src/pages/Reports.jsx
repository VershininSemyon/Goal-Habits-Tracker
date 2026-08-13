import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    createReport,
    deleteReport,
    getReports,
} from "../services/aiReportService.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ start_date: "", end_date: "" });
    const [saving, setSaving] = useState(false);
    const load = async () => {
        setLoading(true);
        try {
            setReports(await getReports());
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, []);
    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createReport(form);
            setOpen(false);
            setForm({ start_date: "", end_date: "" });
            await load();
        } finally {
            setSaving(false);
        }
    };
    const remove = async (id) => {
        if (!window.confirm("Удалить отчёт?")) return;
        await deleteReport(id);
        await load();
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                        AI-аналитика
                    </p>
                    <h1 className="mt-1 text-3xl font-black">
                        Отчёты о прогрессе
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Отчёт создаётся в фоне и анализирует цели, привычки и
                        логи за период.
                    </p>
                </div>
                <Button onClick={() => setOpen(true)}>✦ Новый отчёт</Button>
            </div>
            {loading ? (
                <Spinner />
            ) : reports.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {reports.map((report) => (
                        <article
                            key={report.id}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                                    AI report
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(report.created_at).toLocaleString(
                                        "ru-RU",
                                    )}
                                </span>
                            </div>
                            <h2 className="mt-4 font-black">
                                {new Date(report.start_date).toLocaleDateString(
                                    "ru-RU",
                                )}{" "}
                                —{" "}
                                {new Date(report.end_date).toLocaleDateString(
                                    "ru-RU",
                                )}
                            </h2>
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                                {report.summary_text}
                            </p>
                            <div className="mt-5 flex gap-2">
                                <Link
                                    to={`/reports/${report.id}`}
                                    className="flex-1"
                                >
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        Открыть
                                    </Button>
                                </Link>
                                <Button
                                    variant="danger"
                                    onClick={() => remove(report.id)}
                                >
                                    Удалить
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="🤖"
                    title="Отчётов пока нет"
                    description="Выберите период и запустите первый AI-анализ вашего прогресса."
                    action={
                        <Button onClick={() => setOpen(true)}>
                            Создать отчёт
                        </Button>
                    }
                />
            )}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Новый AI-отчёт"
            >
                <form onSubmit={submit} className="space-y-4">
                    <Input
                        label="Дата начала"
                        type="date"
                        value={form.start_date}
                        onChange={(e) =>
                            setForm({ ...form, start_date: e.target.value })
                        }
                        required
                    />
                    <Input
                        label="Дата окончания"
                        type="date"
                        value={form.end_date}
                        onChange={(e) =>
                            setForm({ ...form, end_date: e.target.value })
                        }
                        required
                    />
                    <p className="text-xs leading-5 text-slate-400">
                        Обе даты не могут быть в будущем, а начало не может быть
                        позже окончания.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setOpen(false)}
                        >
                            Отмена
                        </Button>
                        <Button loading={saving}>Запустить анализ</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
