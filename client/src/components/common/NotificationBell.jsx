import { useState, useRef, useEffect } from "react";
import { Bell, UserRoundPlus, UserRoundCheck } from "lucide-react";

import { useFriendStore } from "../../store/useFriendStore";
import { useMessageStore } from "../../store/useMessageStore";
import { socket } from "../../lib/socket";

import InitialsAvatar from "./InitialsAvatar";
import UserProfileModal from "../search/UserProfileModal";

const notificationMeta = {

    request_received:  { icon: UserRoundPlus,  color: "#04263D",  label: "Friend Request"   },
    request_accepted:  { icon: UserRoundCheck, color: "#198754",  label: "Request Accepted" }, 
    already_sent:      { icon: UserRoundCheck, color: "#f0ad4e",  label: "Already Sent"     },

};

const timeAgo = (timestamp) => {

    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;

};

const NotificationBell = () => {
    
    const {
        pendingRequests,
        notifications,
        markNotificationsRead,
        initializeFriendSocket,
    } = useFriendStore();

    const ref = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {

        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);

    }, []);

    useEffect(() => {
        useFriendStore.getState().fetchPendingRequests();
    }, []);

    const { fetchUsers } = useMessageStore();
    useEffect(() => {

        const {
            handleFriendRequestReceived,
            handleFriendRequestAccepted,
        } = initializeFriendSocket();

        const onAccepted = (data) => handleFriendRequestAccepted(data, fetchUsers);

        socket.on("friendRequestReceived", handleFriendRequestReceived);
        socket.on("friendRequestAccepted", onAccepted);

        return () => {
            socket.off("friendRequestReceived", handleFriendRequestReceived);
            socket.off("friendRequestAccepted", onAccepted);
        };

    }, []);

    const handleOpen = () => {
        setShowDropdown((prev) => !prev);
        if (!showDropdown) markNotificationsRead();
    };

    const [modalUser, setModalUser] = useState(null);

    const unreadCount = notifications.filter((n) => !n.read).length;
    const badgeCount = unreadCount + pendingRequests.length;

    return (

        <>
            <div ref={ref} className="d-inline-flex align-items-center position-relative">

                {/* Bell */}
                <div role="button" aria-label={`Notifications${badgeCount > 0 ? `, ${badgeCount} unread` : ""}`} className="d-inline-flex align-items-center position-relative" onClick={handleOpen} >

                    <Bell color="#04263D" size={24} />
                    {badgeCount > 0 && (

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
                            {badgeCount}

                        </span>

                    )}

                </div>

                {/* Dropdown */}
                {showDropdown && (

                    <div
                        className="position-absolute bg-white shadow rounded"
                        style={{
                            top: "calc(100% + 8px)",
                            right: 0,
                            width: "300px",
                            zIndex: 1050,
                            border: "1px solid #e0e0e0",
                            maxHeight: "420px",
                            overflowY: "auto",
                        }}
                    >
                        <div className="px-3 py-2 border-bottom fw-bold" style={{ fontSize: "0.9rem", color: "#04263D" }} >
                            Notifications
                        </div>

                        {notifications.length === 0 && pendingRequests.length === 0 ? (

                            <div className="text-muted text-center py-4" style={{ fontSize: "0.82rem" }}>
                                No notifications yet
                            </div>

                        ) : (

                            <>
                                {/* Pending requests as clickable notifications */}
                                {pendingRequests.map((req) => (

                                    <div
                                        key={req.requester.username}
                                        role="button"
                                        className="d-flex align-items-center gap-2 px-3 py-2"
                                        style={{
                                            borderBottom: "1px solid #F5F5F5",
                                            backgroundColor: "#F0F8FF",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setModalUser({
                                                ...req.requester,
                                                relationshipStatus: "pending_received",
                                            });
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <InitialsAvatar name={req.requester.fullName} profilePic={req.requester.profilePic} size={38} />

                                        <div className="flex-grow-1 overflow-hidden">

                                            <div className="fw-bold text-truncate" style={{ fontSize: "0.82rem", color: "#04263D" }}>
                                                {req.requester.fullName}
                                            </div>

                                            <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                                                Sent you a friend request
                                            </div>

                                            <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                                                {timeAgo(req.createdAt)}
                                            </div>

                                        </div>
                                        {/* Unread dot */}
                                        <div className="rounded-circle flex-shrink-0" style={{ width: 7, height: 7, backgroundColor: "#5BC8F5" }} />
                                    </div>
                                ))}

                                {/* Notification history */}
                                {notifications
                                    .filter((n) => n.type !== "request_received")
                                    .map((n) => {

                                        const meta = notificationMeta[n.type];
                                        const Icon = meta?.icon;

                                        return (

                                            <div
                                                key={n.id}
                                                className="d-flex align-items-center gap-2 px-3 py-2"
                                                style={{
                                                    borderBottom: "1px solid #f5f5f5",
                                                    backgroundColor: n.read ? "white" : "#fafafa",
                                                }}
                                            >
                                                {/* Avatar with fallback to icon */}
                                                {n.user ? (

                                                    <InitialsAvatar name={n.user.fullName} profilePic={n.user.profilePic} size={38} />

                                                ) : (

                                                    <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: 38, height: 38, backgroundColor: `${meta?.color}18` }} >

                                                        {Icon && <Icon size={16} color={meta.color} />}

                                                    </div>

                                                )}

                                                <div className="flex-grow-1 overflow-hidden">

                                                    <div style={{ fontSize: "0.82rem", color: "#04263D" }}>
                                                        {n.message}
                                                    </div>

                                                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                                                        {timeAgo(n.timestamp)}
                                                    </div>

                                                </div>

                                                {!n.read && (
                                                    <div className="rounded-circle flex-shrink-0" style={{ width: 7, height: 7, backgroundColor: "#5BC8F5" }} />
                                                )}

                                            </div>

                                        );

                                    })

                                }

                            </>

                        )}

                    </div>

                )}

            </div>

            {/*Profile modal — opens when notification clicked */}
            {modalUser && (

                <UserProfileModal
                    user={modalUser}
                    onClose={() => setModalUser(null)}

                    onActionDone={(updatedUser) => {
                        setModalUser(null);
                        if (updatedUser.relationshipStatus === "friends") fetchUsers();
                    }}

                />
                
            )}

        </>

    );

};

export default NotificationBell;