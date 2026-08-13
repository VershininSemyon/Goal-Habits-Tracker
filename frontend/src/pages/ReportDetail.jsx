import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { deleteReport, getReport } from "../services/aiReportService.js";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const load = async () => {
        setLoading(true);
        try {
            setReport(await getReport(id));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, [id]);
    useEffect(() => {
        if (report?.summary_text !== "Генерация отчёта началась")
            return undefined;
        const timer = setInterval(load, 5000);
        return () => clearInterval(timer);
    }, [report?.summary_text, id]);
    if (loading) return <Spinner />;
    if (!report) return null;
    const pending = report.summary_text === "Генерация отчёта началась";
    const remove = async () => {
        if (!window.confirm("Удалить отчёт?")) return;
        await deleteReport(id);
        navigate("/reports");
    };
    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <Link to="/reports" className="text-sm font-bold text-indigo-600">
                ← Все отчёты
            </Link>
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${pending ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                        >
                            {pending ? "Генерируется" : "Готов"}
                        </span>
                        <h1 className="mt-4 text-2xl font-black">
                            Отчёт за{" "}
                            {new Date(report.start_date).toLocaleDateString(
                                "ru-RU",
                            )}{" "}
                            —{" "}
                            {new Date(report.end_date).toLocaleDateString(
                                "ru-RU",
                            )}
                        </h1>
                        <p className="mt-2 text-xs text-slate-400">
                            Создан{" "}
                            {new Date(report.created_at).toLocaleString(
                                "ru-RU",
                            )}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={load}>
                            Обновить
                        </Button>
                        <Button variant="danger" onClick={remove}>
                            Удалить
                        </Button>
                    </div>
                </div>
                <div className="mt-8 rounded-2xl bg-slate-50 p-5 md:p-7">
                    {pending ? (
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                            AI анализирует данные. Нажмите «Обновить» через
                            некоторое время.
                        </div>
                    ) : (
                        <div className="markdown text-sm leading-7 text-slate-700">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {report.summary_text || "Пустой отчёт."}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
