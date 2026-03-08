import { useState, useRef, useEffect, useCallback } from "react";
import { Bell, Check, X } from "lucide-react";

import { useFriendStore } from "../../store/useFriendStore";
import { useMessageStore } from "../../store/useMessageStore";

import InitialsAvatar from "./InitialsAvatar";
import ActionButton from "./ActionButton";

const NotificationBell = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const ref = useRef(null);

    const { pendingRequests, acceptFriendRequest, rejectFriendRequest } = useFriendStore();
    const { fetchUsers } = useMessageStore();

    useEffect(() => {

        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);

    }, []);

    const handleAccept = useCallback(async (requestId) => {
        await acceptFriendRequest(requestId, fetchUsers);
    }, [acceptFriendRequest, fetchUsers]);

    const handleReject = useCallback(async (requestId) => {
        await rejectFriendRequest(requestId);
    }, [rejectFriendRequest]);

    return (

        // d-inline-flex + align-items-center keeps it perfectly in line with sibling icons
        <div ref={ref} className="d-inline-flex align-items-center position-relative">

            <div role="button" className="d-inline-flex align-items-center position-relative" onClick={() => setShowDropdown((prev) => !prev)} >

                <Bell color="#04263D" size={24} />

                {pendingRequests.length > 0 && (

                    <span
                        className="position-absolute badge rounded-pill"
                        style={{
                            top: "-4px",
                            right: "-6px",
                            backgroundColor: "#dc3545",
                            fontSize: "0.5rem",
                            minWidth: "14px",
                            padding: "2px 4px",
                            lineHeight: 1.2,
                        }}
                    >

                        {pendingRequests.length}

                    </span>

                )}
            </div>

            {showDropdown && (

                <div
                    className="position-absolute bg-white shadow rounded"
                    style={{
                        top: "calc(100% + 8px)",
                        right: 0,
                        width: "280px",
                        zIndex: 1050,
                        border: "1px solid #e0e0e0",
                        maxHeight: "360px",
                        overflowY: "auto",
                    }}
                >
                    <div className="px-3 py-2 border-bottom d-flex align-items-center gap-2" style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#04263D" }} >

                        Friend Requests
                        {pendingRequests.length > 0 && (

                            <span className="badge rounded-pill" style={{ backgroundColor: "#dc3545", fontSize: "0.6rem" }} >
                                {pendingRequests.length}
                            </span>
                        )}

                    </div>

                    {pendingRequests.length === 0 ? (

                        <div className="text-muted text-center py-3" style={{ fontSize: "0.82rem" }}>
                            No pending requests
                        </div>

                    ) : (

                        pendingRequests.map((req) => (

                            <div key={req._id} className="d-flex align-items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid #f5f5f5" }} >

                                <InitialsAvatar name={req.requester.fullName} profilePic={req.requester.profilePic} size={36} />

                                <div className="flex-grow-1 overflow-hidden">

                                    <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", color: "#04263D" }}>
                                        {req.requester.fullName}
                                    </div>

                                    {req.requester.jobTitle && (

                                        <div className="text-muted text-truncate" style={{ fontSize: "0.72rem" }}>
                                            {req.requester.jobTitle}
                                        </div>
                                    )}

                                </div>

                                <div className="d-flex gap-1 flex-shrink-0">

                                    <ActionButton color="#d4edda" hoverColor="#b8ddc4" onClick={() => handleAccept(req._id)} title="Accept" size={26}>
                                        <Check size={13} color="#198754" />
                                    </ActionButton>

                                    <ActionButton color="#f8d7da" hoverColor="#f1b0b7" onClick={() => handleReject(req._id)} title="Reject" size={26}>
                                        <X size={13} color="#dc3545" />
                                    </ActionButton>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            )}

        </div>

    );

};

export default NotificationBell;