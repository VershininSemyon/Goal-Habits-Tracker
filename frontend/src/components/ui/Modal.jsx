export default function Modal({ open, title, children, onClose, footer }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        ×
                    </button>
                </div>
                {children}
                {footer && (
                    <div className="mt-6 flex justify-end gap-3">{footer}</div>
                )}
            </div>
        </div>
    );
}
