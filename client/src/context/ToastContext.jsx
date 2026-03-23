import { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

    const [toast, setToast] = useState({
        show: false,
        message: "",
        variant: "success"
    });

    const showToast = useCallback((message, variant = "success") => {
        setToast({ show: true, message, variant });

        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Global Toast UI */}
            <ToastContainer
                position="top-end"
                className="p-3"
                style={{ zIndex: 9999 }}
            >
                <Toast
                    show={toast.show}
                    bg={toast.variant}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                    autohide
                    delay={3000}
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            {toast.variant === "success" ? "Success" : "Error"}
                        </strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body className="text-white">
                        {toast.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);