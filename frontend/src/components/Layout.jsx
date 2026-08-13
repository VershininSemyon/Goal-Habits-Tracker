import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import Button from "./ui/Button.jsx";
import Toast from "./ui/Toast.jsx";
import { useState } from "react";

const navItems = [
    ["/dashboard", "Обзор"],
    ["/goals", "Цели"],
    ["/reports", "AI-отчёты"],
    ["/profile", "Профиль"],
];

export default function Layout() {
    const { user, logout } = useAuth();
    const { toast, hideToast } = useToast();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    const linkClass = ({ isActive }) =>
        `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

    return (
        <div className="min-h-screen bg-slate-50">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        to={user ? "/dashboard" : "/"}
                        className="flex items-center gap-2.5"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                            ✓
                        </span>
                        <span className="text-lg font-black tracking-tight text-slate-900">
                            GoalFlow
                        </span>
                    </Link>
                    <nav className="hidden items-center gap-1 md:flex">
                        {user &&
                            navItems.map(([to, label]) => (
                                <NavLink key={to} to={to} className={linkClass}>
                                    {label}
                                </NavLink>
                            ))}
                    </nav>
                    <div className="hidden items-center gap-3 md:flex">
                        {user ? (
                            <>
                                <div className="hidden text-right lg:block">
                                    <p className="text-sm font-bold text-slate-800">
                                        {user.username}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {user.email}
                                    </p>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-slate-600"
                                >
                                    Войти
                                </Link>
                                <Link to="/register">
                                    <Button>Начать</Button>
                                </Link>
                            </>
                        )}
                    </div>
                    <button
                        className="rounded-xl p-2 text-slate-600 md:hidden"
                        onClick={() => setMobileOpen((v) => !v)}
                    >
                        {mobileOpen ? "×" : "☰"}
                    </button>
                </div>
                {mobileOpen && (
                    <div className="border-t border-slate-100 bg-white p-3 md:hidden">
                        {user ? (
                            <div className="grid gap-1">
                                {navItems.map(([to, label]) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        className={linkClass}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {label}
                                    </NavLink>
                                ))}
                                <button
                                    className="mt-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="flex-1">
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        Войти
                                    </Button>
                                </Link>
                                <Link to="/register" className="flex-1">
                                    <Button className="w-full">Начать</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>
            <main className="mx-auto min-h-[calc(100vh-9rem)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} GoalFlow · цели, привычки и
                    прогресс
                </div>
            </footer>
        </div>
    );
}
