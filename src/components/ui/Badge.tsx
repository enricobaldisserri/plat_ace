export const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "info" }) => {
    const styles = {
        default: "bg-slate-100 text-slate-800",
        success: "bg-emerald-100 text-emerald-800",
        warning: "bg-amber-100 text-amber-800",
        info: "bg-blue-100 text-blue-800",
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[variant]}`}>{children}</span>;
};
