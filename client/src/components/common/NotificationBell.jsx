import { useState, useRef, useEffect } from "react";
import { Bell, UserRoundPlus, UserRoundCheck, UserRoundX } from "lucide-react";

import { useFriendStore } from "../../store/useFriendStore";
import { useMessageStore } from "../../store/useMessageStore";
import { useToast } from "../../context/ToastContext";
import { socket } from "../../lib/socket";

import InitialsAvatar from "./InitialsAvatar";
import UserProfileModal from "../search/UserProfileModal";

const notificationMeta = {

    request_received: { icon: UserRoundPlus,  color: "#04263D", label: "Friend Request"     },
    request_accepted: { icon: UserRoundCheck, color: "#198754", label: "Request Accepted"   },
    already_sent:     { icon: UserRoundCheck, color: "#f0ad4e", label: "Already Sent"       },
    request_rejected: { icon: UserRoundX,     color: "#dc3545", label: "Request Declined"   },
    unfriended:       { icon: UserRoundX,     color: "#6c757d", label: "Removed Friend"     },

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
        readPendingRequests,
        markNotificationRead,
        markPendingRequestRead,
        pruneOldNotifications,
        initializeFriendSocket,
    } = useFriendStore();

    const { showToast } = useToast();

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
        useFriendStore.getState().fetchNotifications();
    }, []);

    const { fetchUsers } = useMessageStore();
    useEffect(() => {

        const {
            handleFriendRequestReceived,
            handleFriendRequestAccepted,
            handleFriendRequestCancelled,
            handleFriendRequestRejected,
            handleUnfriended,
        } = initializeFriendSocket();

        const onAccepted = (data) => handleFriendRequestAccepted(data, fetchUsers);

        socket.on("friendRequestReceived", handleFriendRequestReceived);
        socket.on("friendRequestAccepted", onAccepted);
        socket.on("friendRequestCancelled", handleFriendRequestCancelled);
        socket.on("friendRequestRejected", handleFriendRequestRejected);
        socket.on("unfriended", handleUnfriended);

        return () => {
            socket.off("friendRequestReceived", handleFriendRequestReceived);
            socket.off("friendRequestAccepted", onAccepted);
            socket.off("friendRequestCancelled", handleFriendRequestCancelled);
            socket.off("friendRequestRejected", handleFriendRequestRejected);
            socket.off("unfriended", handleUnfriended);
        };

    }, []);

    // Fire a toast for each new unread notification as it arrives
    const prevNotifCountRef = useRef(0);
    useEffect(() => {
        const unread = notifications.filter((n) => !n.read);
        if (unread.length > prevNotifCountRef.current) {
            const latest = unread[0];
            if (latest) {
                const toastConfig = {
                    request_received: { variant: "info",    title: "Friend Request"   },
                    request_accepted: { variant: "success", title: "Request Accepted" },
                    request_rejected: { variant: "warning", title: "Request Declined" },
                    unfriended:       { variant: "warning", title: "Removed Friend"   },
                    already_sent:     { variant: "warning", title: "Already Sent"     },
                };
                const cfg = toastConfig[latest.type];
                if (cfg) {
                    showToast(latest.message, cfg.variant, cfg.title);
                }
            }
        }
        prevNotifCountRef.current = unread.length;
    }, [notifications]);

    const handleOpen = () => {
        setShowDropdown((prev) => !prev);
        if (!showDropdown) {
            pruneOldNotifications();
        }
    };

    const [modalUser, setModalUser] = useState(null);

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const isPendingRequestUnread = (req) => !readPendingRequests.includes(req.requester.username);

    const visibleNotifications = notifications
        .filter((n) => now - new Date(n.timestamp).getTime() < SEVEN_DAYS_MS)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pending requests are always shown regardless of age; sort latest first
    const visiblePendingRequests = [...pendingRequests]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = visibleNotifications.filter((n) => !n.read && n.type !== "request_received").length;
    const unreadPendingCount = visiblePendingRequests.filter(isPendingRequestUnread).length;
    const badgeCount = unreadCount + unreadPendingCount;

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

                        {visibleNotifications.length === 0 && visiblePendingRequests.length === 0 ? (

                            <div className="text-muted text-center py-4" style={{ fontSize: "0.82rem" }}>
                                No notifications yet
                            </div>

                        ) : (

                            <>
                                {/* Pending requests as clickable notifications */}
                                {visiblePendingRequests.map((req) => (

                                    <div
                                        key={req.requester.username}
                                        role="button"
                                        className="d-flex align-items-center gap-2 px-3 py-2"
                                        style={{
                                            borderBottom: "1px solid #F5F5F5",
                                            backgroundColor: isPendingRequestUnread(req) ? "#F0F8FF" : "white",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            markPendingRequestRead(req.requester.username);
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
                                        {/* Unread dot — hidden once clicked or bell was opened after this request arrived */}
                                        {isPendingRequestUnread(req) && (
                                            <div className="rounded-circle flex-shrink-0" style={{ width: 7, height: 7, backgroundColor: "#5BC8F5" }} />
                                        )}
                                    </div>
                                ))}

                                {/* Notification history */}
                                {visibleNotifications
                                    .filter((n) => n.type !== "request_received")
                                    .map((n) => {

                                        const meta = notificationMeta[n.type];
                                        const Icon = meta?.icon;

                                        return (

                                            <div
                                                key={n.id}
                                                role="button"
                                                className="d-flex align-items-center gap-2 px-3 py-2"
                                                style={{
                                                    borderBottom: "1px solid #f5f5f5",
                                                    backgroundColor: n.read ? "white" : "#f8fbff",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    markNotificationRead(n.id);
                                                    if (n.user) {
                                                        setModalUser({ ...n.user, relationshipStatus: n.type === "request_accepted" ? "friends" : "none" });
                                                        setShowDropdown(false);
                                                    }
                                                }}
                                            >
                                                {/* Avatar with icon badge for type */}
                                                <div className="position-relative flex-shrink-0">
                                                    {n.user ? (
                                                        <InitialsAvatar name={n.user.fullName} profilePic={n.user.profilePic} size={38} />
                                                    ) : (
                                                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 38, height: 38, backgroundColor: `${meta?.color}18` }}>
                                                            {Icon && <Icon size={16} color={meta.color} />}
                                                        </div>
                                                    )}
                                                    {meta && (
                                                        <div
                                                            className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                bottom: -2, right: -2,
                                                                width: 16, height: 16,
                                                                backgroundColor: meta.color,
                                                                border: "1.5px solid white",
                                                            }}
                                                        >
                                                            {Icon && <Icon size={9} color="white" />}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-grow-1 overflow-hidden">

                                                    <div style={{ fontSize: "0.82rem", color: "#04263D" }}>
                                                        {n.message}
                                                    </div>

                                

                                                    <div className="text-muted" style={{ fontSize: "0.68rem" }}>
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