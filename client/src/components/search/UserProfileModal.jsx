import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { UserRoundPlus, UserRoundMinus, MessageCircleMore, Check, X, Ban } from "lucide-react";

import { useFriendStore } from "../../store/useFriendStore";
import { useMessageStore } from "../../store/useMessageStore";
import { useToast } from "../../context/ToastContext";

import InitialsAvatar from "../common/InitialsAvatar";

const UserProfileModal = ({ user, onClose, onActionDone }) => {

    const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, unfriend } = useFriendStore();
    const { users, selectUser } = useMessageStore();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(null); // "send" | "accept" | "reject" | "cancel" | "unfriend"

    if (!user) return null;

    const withLoading = (key, fn) => async () => {
        setLoading(key);
        try { await fn(); } catch { /* errors handled in store */ } finally { setLoading(null); }
    };

    //Send request
    const handleSendRequest = withLoading("send", async () => {
        await sendFriendRequest(user.username);
        showToast(`Friend request sent to ${user.fullName}!`, "success", "Friend Request Sent");
        onActionDone?.({ ...user, relationshipStatus: "pending_sent" });
    });

    //Accept request
    const handleAccept = withLoading("accept", async () => {
        await acceptFriendRequest(user.username);
        showToast(`You are now friends with ${user.fullName}!`, "success", "Request Accepted");
        onActionDone?.({ ...user, relationshipStatus: "friends" });
    });

    //Reject request
    const handleReject = withLoading("reject", async () => {
        await rejectFriendRequest(user.username);
        showToast(`Request from ${user.fullName} declined.`, "warning", "Request Declined");
        onActionDone?.({ ...user, relationshipStatus: "none", friendshipId: null });
    });

    // Cancel sent request
    const handleCancel = withLoading("cancel", async () => {
        await cancelFriendRequest(user.username);
        showToast(`Friend request to ${user.fullName} cancelled.`, "warning", "Request Cancelled");
        onActionDone?.({ ...user, relationshipStatus: "none", friendshipId: null });
    });

    // Unfriend
    const handleUnfriend = withLoading("unfriend", async () => {
        await unfriend(user.username);
        showToast(`You unfriended ${user.fullName}.`, "warning", "Unfriended");
        onActionDone?.({ ...user, relationshipStatus: "none", friendshipId: null });
    });

    const handleMessage = () => {
        const storeUser = users.find((u) => u.conversationId?.toString() === user.conversationId?.toString());
        if (storeUser) {
            selectUser(storeUser);
            onClose();
        }
    };

    const spin = (key) => loading === key
        ? <Spinner animation="border" size="sm" className="me-1" style={{ width: 13, height: 13, borderWidth: 2 }} />
        : null;

    return (

        <Modal show onHide={onClose} centered size="sm">

            <Modal.Header closeButton className="border-0 pb-0" />

            <Modal.Body className="text-center px-4 pb-4">

                <div className="d-flex justify-content-center mb-3">

                    {user.profilePic ? (
                        
                        <img
                            src={user.profilePic}
                            alt={user.fullName}
                            style={{
                                width: 80, height: 80,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "3px solid #DEE2E6",
                            }}
                        />

                    ) : (
                        <InitialsAvatar name={user.fullName} profilePic={user.profilePic} size={80} />
                    )}

                </div>

                <h5 className="fw-bold mb-1" style={{ color: "#04263D" }}>
                    {user.fullName}
                </h5>

                {user.jobTitle && (

                    <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                        {user.jobTitle}
                    </p>

                )}

                {user.location && (

                    <p style={{ fontSize: "0.78rem", color: "#AAAAAA" }} className="mb-3">
                        {user.location}
                    </p>

                )}

                <div className="d-flex justify-content-center gap-2 mt-3">

                    {user.relationshipStatus === "none" && (

                        <Button size="sm" style={{ backgroundColor: "#04263D", border: "none" }} onClick={handleSendRequest} disabled={loading === "send"} >
                            {spin("send")}
                            {!spin("send") && <UserRoundPlus size={15} className="me-1" />}
                            Add Friend
                        </Button>
                    )}

                    {/* Cancel sent request */}
                    {user.relationshipStatus === "pending_sent" && (

                        <Button size="sm" variant="outline-secondary" onClick={handleCancel} disabled={loading === "cancel"} >
                            {spin("cancel")}
                            {!spin("cancel") && <Ban size={15} className="me-1" />}
                            Cancel Request
                        </Button>
                    )}

                    {user.relationshipStatus === "pending_received" && (

                        <>
                            <Button size="sm" variant="outline-primary" onClick={handleAccept} disabled={!!loading}>
                                {spin("accept")}
                                {!spin("accept") && <Check size={15} className="me-1" />}
                                Accept
                            </Button>

                            <Button size="sm" variant="outline-danger" onClick={handleReject} disabled={!!loading}>
                                {spin("reject")}
                                {!spin("reject") && <X size={15} className="me-1" />}
                                Reject
                            </Button>
                            
                        </>

                    )}

                    {/* Friends — message + unfriend */}
                    {user.relationshipStatus === "friends" && (

                        <>

                            <Button size="sm" style={{ backgroundColor: "#04263D", border: "none" }} onClick={handleMessage} >
                                <MessageCircleMore size={15} className="me-1" />
                                Message
                            </Button>

                            <Button size="sm" variant="outline-danger" onClick={handleUnfriend} disabled={loading === "unfriend"} >
                                {spin("unfriend")}
                                {!spin("unfriend") && <UserRoundMinus size={15} className="me-1" />}
                                Unfriend
                            </Button>

                        </>

                    )}

                </div>

            </Modal.Body>

        </Modal>
    );
};

export default UserProfileModal;