import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import styles from "../styles/UI/Toast.module.css";

const ToastContext = createContext();

const defaultTitles = {
    success: "Success",
    danger: "Error",
    warning: "Warning",
    info: "Info",
};

const variantIcons = {
    success: CheckCircle,
    danger:  XCircle,
    warning: AlertTriangle,
    info:    Info,
};

const DURATION = 3000;

const ToastItem = ({ toast, onDismiss }) => {
    const [hiding, setHiding] = useState(false);
    const timerRef = useRef(null);

    const dismiss = useCallback(() => {
        setHiding(true);
        setTimeout(() => onDismiss(toast.id), 250);
    }, [toast.id, onDismiss]);

    useEffect(() => {
        timerRef.current = setTimeout(dismiss, DURATION);
        return () => clearTimeout(timerRef.current);
    }, [dismiss]);

    const Icon = variantIcons[toast.variant] ?? Info;

    return (
        <div
            className={[styles.toast, styles[toast.variant], hiding ? styles.hiding : ""].join(" ")}
            role="alert"
        >
            <div className={styles.iconWrapper}>
                <Icon size={18} />
            </div>

            <div className={styles.content}>
                <div className={styles.title}>{toast.title}</div>
                <div className={styles.message}>{toast.message}</div>
            </div>

            <button className={styles.closeBtn} onClick={dismiss} aria-label="Dismiss">
                <X size={15} />
            </button>

            <div className={styles.progress} />
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, variant = "success", title) => {
        const id = Date.now();
        setToasts((prev) => [
            ...prev,
            { id, message, variant, title: title || defaultTitles[variant] || "Notice" },
        ]);
    }, []);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
            ))}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);