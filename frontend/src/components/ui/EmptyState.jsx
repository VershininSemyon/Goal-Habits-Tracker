export default function EmptyState({ icon = '✦', title, description, action }) {
    return <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">{icon}</div><h3 className="text-lg font-bold text-slate-900">{title}</h3>{description && <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>}{action && <div className="mt-5">{action}</div>}</div>;
}
