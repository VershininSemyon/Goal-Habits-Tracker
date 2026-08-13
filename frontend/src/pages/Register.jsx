import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService.js';
import Input from '../components/ui/Input.jsx';
import PasswordInput from '../components/ui/PasswordInput.jsx';
import Button from '../components/ui/Button.jsx';

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '' }); const [loading, setLoading] = useState(false); const navigate = useNavigate();
    const submit = async (e) => { e.preventDefault(); setLoading(true); try { await register(form); navigate('/login'); } finally { setLoading(false); } };
    return <div className="mx-auto mt-8 max-w-md"><div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9"><div className="mb-7"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">✓</div><h1 className="text-2xl font-black">Создайте аккаунт</h1><p className="mt-2 text-sm leading-6 text-slate-500">Начните отслеживать цели и привычки уже сегодня.</p></div><form onSubmit={submit} className="space-y-4"><Input label="Имя пользователя" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required maxLength={100} autoComplete="username" /><Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" /><PasswordInput label="Пароль" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} hint="Минимум 8 символов" autoComplete="new-password" /><Button loading={loading} type="submit" className="mt-2 w-full">Создать аккаунт</Button></form><p className="mt-5 text-center text-sm text-slate-500">Уже зарегистрированы? <Link to="/login" className="font-bold text-indigo-600 hover:underline">Войти</Link></p></div></div>;
}
