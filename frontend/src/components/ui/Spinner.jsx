export default function Spinner({ label = "Загрузка..." }) {
    return (
        <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-slate-500">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            {label}
        </div>
    );
}
