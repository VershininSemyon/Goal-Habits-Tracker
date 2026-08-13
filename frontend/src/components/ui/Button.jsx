export default function Button({ children, variant = 'primary', className = '', loading = false, ...props }) {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-200',
        secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm shadow-rose-200',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    };
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />}
            {children}
        </button>
    );
}
