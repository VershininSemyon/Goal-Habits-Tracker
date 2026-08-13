import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4500);
        return () => clearTimeout(timer);
    }, [onClose]);
    const styles = {
        info: "bg-slate-900",
        success: "bg-emerald-600",
        error: "bg-rose-600",
        warning: "bg-amber-500",
    };
    return (
        <div
            className={`fixed right-4 top-4 z-[100] max-w-sm rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-2xl ${styles[type] || styles.info}`}
        >
            <div className="flex items-start gap-3">
                <span className="mt-0.5">
                    {type === "success"
                        ? "✓"
                        : type === "warning"
                          ? "!"
                          : type === "error"
                            ? "×"
                            : "i"}
                </span>
                <p className="flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="opacity-70 hover:opacity-100"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
