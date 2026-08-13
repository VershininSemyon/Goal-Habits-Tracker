import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";

export default function Home() {
    const { user } = useAuth();
    const features = [
        [
            "🎯",
            "Цели",
            "Формулируйте цели с дедлайнами, статусами и удобной фильтрацией.",
        ],
        [
            "🔁",
            "Привычки",
            "Привязывайте ежедневные и еженедельные привычки к каждой цели.",
        ],
        [
            "📈",
            "Прогресс",
            "Ведите логи выполнения и смотрите накопленный результат.",
        ],
        [
            "🤖",
            "AI-отчёты",
            "Получайте персональный анализ прогресса за выбранный период.",
        ],
    ];
    return (
        <div className="-mx-4 -mt-8 sm:-mx-6 lg:-mx-8">
            <section className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm">
                        ✦ Система личного прогресса
                    </div>
                    <h1 className="text-balance text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
                        Цели превращаются в результат через{" "}
                        <span className="text-indigo-600">систему</span>.
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                        GoalFlow объединяет цели, привычки, ежедневный прогресс
                        и AI-анализ в одном спокойном рабочем пространстве.
                    </p>
                    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                        {user ? (
                            <Link to="/dashboard">
                                <Button className="px-7 py-3">
                                    Открыть мой обзор →
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register">
                                    <Button className="px-7 py-3">
                                        Создать аккаунт бесплатно
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button
                                        variant="secondary"
                                        className="px-7 py-3"
                                    >
                                        Войти
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>
            <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                            Всё в одном месте
                        </p>
                        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                            От намерения до измеримого прогресса
                        </h2>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {features.map(([icon, title, text]) => (
                            <div
                                key={title}
                                className="rounded-3xl border border-slate-100 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                            >
                                <div className="text-3xl">{icon}</div>
                                <h3 className="mt-5 text-lg font-bold">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
