import { useEffect, useRef } from "react";
import { PhoneOff, Mic, MicOff } from "lucide-react";
import { useCallStore } from "../../store/useCallStore";
import InitialsAvatar from "../common/InitialsAvatar";

const CallModal = () => {

    const { activeCall, callStatus, isMuted, remoteStream, endCall, toggleMute } = useCallStore();
    const remoteAudioRef = useRef(null);

    // Attach remote stream to audio element
    useEffect(() => {
        if (remoteAudioRef.current && remoteStream) {
            remoteAudioRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    if (!activeCall) return null;

    return (

        <div
            className="position-fixed d-flex flex-column align-items-center justify-content-center bg-white shadow-lg rounded"
            style={{
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 2000,
                width: "260px",
                padding: "24px 16px",
                border: "1px solid #E0E0E0",
            }}
        >
            {/* Hidden audio element for remote stream */}
            <audio ref={remoteAudioRef} autoPlay />

            <InitialsAvatar
                name={activeCall.name}
                profilePic={activeCall.profilePic}
                size={64}
            />

            <div className="fw-bold mt-3 mb-1" style={{ fontSize: "1rem", color: "#04263D" }}>
                {activeCall.name}
            </div>

            <div className="text-muted mb-4" style={{ fontSize: "0.78rem" }}>
                {callStatus === "calling" ? "Calling..." : "Connected"}
            </div>

            {/* Controls */}
            <div className="d-flex gap-3">

                {/* Mute toggle */}
                <div
                    role="button"
                    title={isMuted ? "Unmute" : "Mute"}
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                        width: 48, height: 48,
                        backgroundColor: isMuted ? "#04263D" : "#F0F0F0",
                        cursor: "pointer",
                    }}

                    onClick={toggleMute}
                >
                    {isMuted
                        ? <MicOff size={20} color="#FFFFFF" />
                        : <Mic size={20} color="#04263D" />
                    }
                    
                </div>

                {/* End call */}
                <div
                    role="button"
                    title="End call"
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: 48, height: 48, backgroundColor: "#DC3545", cursor: "pointer" }}
                    onClick={endCall}
                >
                    <PhoneOff size={20} color="#FFFFFF" />

                </div>

            </div>

        </div>

    );

};

export default CallModal;