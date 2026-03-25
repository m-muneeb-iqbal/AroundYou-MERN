import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Button } from "react-bootstrap";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";

const VerifyEmailPage = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuthStore();

    const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "expired" | "invalid"
    const [message, setMessage] = useState("");
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            return;
        }
        verifyToken(token);
    }, []);

    const verifyToken = async (token) => {

        try {

            const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
            setStatus("success");
            setMessage(res.data.message);

            // Auto login — checkAuth picks up the JWT cookie issued by backend
            await checkAuth();

            // Countdown then redirect
            let count = 3;
            const interval = setInterval(() => {
                count -= 1;
                setCountdown(count);
                if (count === 0) {
                    clearInterval(interval);
                    navigate("/home");
                }
            }, 1000);

        } catch (err) {

            const status = err.response?.status;
            const message = err.response?.data?.message;

            if (status === 400 && message?.includes("expired")) {
                setStatus("expired");
                setMessage(message);
            } else {
                setStatus("invalid");
                setMessage(message || "Invalid verification link.");
            }

        }

    };

    const handleResend = async () => {
        // Can't resend without email — send back to landing page
        navigate("/");
    };

    return (

        <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>

            {status === "verifying" && (

                <div className="text-center">
                    <Spinner animation="border" style={{ color: "#04263D" }} className="mb-3" />
                    <p className="text-muted">Verifying your email...</p>
                </div>

            )}

            {status === "success" && (

                <div className="text-center">
                    <div style={{ fontSize: "3rem" }}>✓</div>
                    <h4 className="fw-bold mt-3" style={{ color: "#04263D" }}>Email Verified!</h4>
                    <p className="text-muted mb-1">Your account is ready.</p>
                    <p className="text-muted small mb-4">
                        Redirecting in <strong>{countdown}</strong>s...
                    </p>
                    <Button
                        onClick={() => navigate("/home")}
                        style={{ backgroundColor: "#04263D", borderColor: "#04263D", minWidth: "180px" }}
                    >
                        Continue to Dashboard
                    </Button>
                </div>

            )}

            {status === "expired" && (

                <div className="text-center">

                    <div style={{ fontSize: "3rem" }}>⏰</div>
                    <h4 className="fw-bold mt-3" style={{ color: "#04263D" }}>Link Expired</h4>
                    <p className="text-muted">{message}</p>
                    <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                        Go back to sign up and we'll send a fresh link.
                    </p>

                    <button
                        onClick={handleResend}
                        style={{ backgroundColor: "#04263D", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer" }}
                    >
                        Back to Sign Up
                    </button>

                </div>

            )}

            {status === "invalid" && (

                <div className="text-center">

                    <div style={{ fontSize: "3rem" }}>❌</div>
                    <h4 className="fw-bold mt-3" style={{ color: "#04263D" }}>Invalid Link</h4>
                    <p className="text-muted">{message}</p>

                    <button
                        onClick={() => navigate("/")}
                        style={{ backgroundColor: "#04263D", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer" }}
                    >
                        Back to Home
                    </button>
                </div>

            )}

        </Container>

    );

};

export default VerifyEmailPage;