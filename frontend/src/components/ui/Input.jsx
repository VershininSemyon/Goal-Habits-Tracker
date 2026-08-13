export default function Input({
    label,
    error,
    hint,
    className = "",
    ...props
}) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-semibold text-slate-700">
                    {label}
                </label>
            )}
            <input
                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${error ? "border-rose-400" : "border-slate-200"} ${className}`}
                {...props}
            />
            {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
            {error && (
                <p className="text-xs font-medium text-rose-600">{error}</p>
            )}
        </div>
    );
}
