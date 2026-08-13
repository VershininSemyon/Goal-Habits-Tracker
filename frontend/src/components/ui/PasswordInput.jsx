import { useState } from "react";

export default function PasswordInput({
    label,
    error,
    className = "",
    ...props
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-semibold text-slate-700">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 pr-11 text-sm transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${error ? "border-rose-400" : "border-slate-200"} ${className}`}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShow((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
                >
                    {show ? "Скрыть" : "Показать"}
                </button>
            </div>
            {error && (
                <p className="text-xs font-medium text-rose-600">{error}</p>
            )}
        </div>
    );
}
