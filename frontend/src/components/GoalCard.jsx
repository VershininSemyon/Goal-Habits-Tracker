import { Link } from "react-router-dom";
import Button from "./ui/Button.jsx";

const status = {
    in_progress: ["В процессе", "bg-amber-50 text-amber-700"],
    completed: ["Завершена", "bg-emerald-50 text-emerald-700"],
    archived: ["Архив", "bg-slate-100 text-slate-600"],
};

export default function GoalCard({ goal, onDelete }) {
    const [label, cls] = status[goal.status] || status.in_progress;
    const deadline = new Date(goal.deadline);
    const overdue = deadline.getTime() < Date.now();
    return (
        <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="mb-4 flex items-start justify-between gap-3">
                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}
                >
                    {label}
                </span>
                <span className="text-xs text-slate-400">
                    {new Date(goal.created_at).toLocaleDateString("ru-RU")}
                </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                {goal.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-500 line-clamp-3">
                {goal.description || "Без описания"}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span
                    className={`text-xs font-semibold ${overdue ? "text-rose-600" : "text-slate-500"}`}
                >
                    Дедлайн · {deadline.toLocaleDateString("ru-RU")}
                </span>
                <div className="flex gap-2">
                    <Link to={`/goals/${goal.id}`}>
                        <Button variant="secondary" className="px-3 py-2">
                            Открыть
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        className="px-3 py-2"
                        onClick={() => onDelete(goal.id)}
                    >
                        Удалить
                    </Button>
                </div>
            </div>
        </article>
    );
}
