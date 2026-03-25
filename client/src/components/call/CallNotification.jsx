import { Phone, PhoneOff } from "lucide-react";
import { useCallStore } from "../../store/useCallStore";
import InitialsAvatar from "../common/InitialsAvatar";

const CallNotification = () => {

    const { incomingCall, acceptCall, rejectCall } = useCallStore();

    if (!incomingCall) return null;

    return (
        <div
            className="position-fixed bg-white shadow-lg rounded d-flex align-items-center gap-3 p-3"
            style={{
                top: "80px",
                right: "24px",
                zIndex: "var(--z-call-notify, 1300)",
                width: "min(300px, calc(100vw - 2rem))",
                border: "1px solid #E0E0E0",
            }}
        >
            <InitialsAvatar
                name={incomingCall.callerInfo.name}
                profilePic={incomingCall.callerInfo.profilePic}
                size={44}
            />

            <div className="flex-grow-1 overflow-hidden">

                <div className="fw-bold text-truncate" style={{ fontSize: "0.9rem", color: "#04263D" }}>
                    {incomingCall.callerInfo.name}
                </div>

                <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                    Incoming audio call...
                </div>

            </div>

            <div className="d-flex gap-2 flex-shrink-0">

                {/* Accept */}
                <div
                    role="button"
                    title="Accept"
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: 36, height: 36, backgroundColor: "#D4EDDA", cursor: "pointer" }}
                    onClick={acceptCall}
                >

                    <Phone size={16} color="#198754" />

                </div>

                {/* Reject */}
                <div
                    role="button"
                    title="Reject"
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: 36, height: 36, backgroundColor: "#F8D7DA", cursor: "pointer" }}
                    onClick={rejectCall}
                >
                    <PhoneOff size={16} color="#DC3545" />

                </div>

            </div>

        </div>

    );
    
};

export default CallNotification;