import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginService } from "../services/authService.js";
import { useAuth } from "../hooks/useAuth.js";
import Input from "../components/ui/Input.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";
import Button from "../components/ui/Button.jsx";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginService(form);
            await login();
            navigate(location.state?.from?.pathname || "/dashboard", {
                replace: true,
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthShell
            title="С возвращением"
            subtitle="Войдите, чтобы продолжить работу с целями."
        >
            <form onSubmit={submit} className="space-y-4">
                <Input
                    label="Имя пользователя"
                    value={form.username}
                    onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                    }
                    required
                    autoComplete="username"
                />
                <PasswordInput
                    label="Пароль"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    required
                    autoComplete="current-password"
                />
                <Button loading={loading} type="submit" className="mt-2 w-full">
                    Войти
                </Button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-500">
                Нет аккаунта?{" "}
                <Link
                    to="/register"
                    className="font-bold text-indigo-600 hover:underline"
                >
                    Зарегистрироваться
                </Link>
            </p>
        </AuthShell>
    );
}

function AuthShell({ title, subtitle, children }) {
    return (
        <div className="mx-auto mt-8 max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
                <div className="mb-7">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
                        ✓
                    </div>
                    <h1 className="text-2xl font-black">{title}</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {subtitle}
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}
