import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMe, getMe, updateMe } from "../services/userService.js";
import { useAuth } from "../hooks/useAuth.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function Profile() {
    const { updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ username: "", email: "" });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        getMe()
            .then((data) => {
                setUser(data);
                setForm({ username: data.username, email: data.email });
            })
            .finally(() => setLoading(false));
    }, []);
    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await updateMe(form);
            setUser(updated);
            updateUser(updated);
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };
    const remove = async () => {
        if (!window.confirm("Удалить аккаунт? Это действие необратимо."))
            return;
        await deleteMe();
        await logout();
        navigate("/");
    };
    if (loading) return <Spinner />;
    if (!user) return null;
    return (
        <div className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-black text-indigo-700">
                        {user.username.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black">Профиль</h1>
                        <p className="text-sm text-slate-500">
                            Управление вашими данными и аккаунтом.
                        </p>
                    </div>
                </div>
                {editing ? (
                    <form onSubmit={save} className="mt-7 space-y-4">
                        <Input
                            label="Имя пользователя"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                            maxLength={100}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            required
                        />
                        <div className="flex gap-2">
                            <Button loading={saving}>Сохранить</Button>
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => setEditing(false)}
                            >
                                Отмена
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-7 space-y-5">
                        <Info label="Имя пользователя" value={user.username} />
                        <Info label="Email" value={user.email} />
                        <Info
                            label="Дата регистрации"
                            value={new Date(
                                user.registration_date,
                            ).toLocaleString("ru-RU")}
                        />
                        <Button
                            variant="secondary"
                            onClick={() => setEditing(true)}
                        >
                            Редактировать
                        </Button>
                    </div>
                )}
                <div className="mt-8 border-t border-rose-100 pt-6">
                    <h2 className="font-black text-rose-700">Опасная зона</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Удаление аккаунта необратимо и удаляет ваши данные.
                    </p>
                    <Button variant="danger" className="mt-4" onClick={remove}>
                        Удалить аккаунт
                    </Button>
                </div>
            </div>
        </div>
    );
}
function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p className="mt-1 font-semibold text-slate-800">{value}</p>
        </div>
    );
}
