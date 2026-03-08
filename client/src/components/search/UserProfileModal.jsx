import { Modal, Button } from "react-bootstrap";
import { UserRoundPlus, UserRoundMinus, MessageCircleMore, Check, X, Ban } from "lucide-react";

import { useFriendStore } from "../../store/useFriendStore";
import { useMessageStore } from "../../store/useMessageStore";

import InitialsAvatar from "../common/InitialsAvatar";

const UserProfileModal = ({ user, onClose, onActionDone }) => {

    const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, unfriend } = useFriendStore();
    const { users, selectUser } = useMessageStore();

    if (!user) return null;

    //Send request
    const handleSendRequest = async () => {
        await sendFriendRequest(user._id);
        onActionDone?.({ ...user, relationshipStatus: "pending_sent" });
    };

    //Accept request
    const handleAccept = async () => {
        await acceptFriendRequest(user.friendshipId);
        onActionDone?.({ ...user, relationshipStatus: "friends" });
    };

    //Reject request
    const handleReject = async () => {
        await rejectFriendRequest(user.friendshipId);
        onActionDone?.({ ...user, relationshipStatus: "none", friendshipId: null });
    };

    // Cancel sent request
    const handleCancel = async () => {
        await cancelFriendRequest(user.friendshipId);
        onActionDone?.({ ...user, relationshipStatus: "none", friendshipId: null });
    };

    // Unfriend
    const handleUnfriend = async () => {
        await unfriend(user._id);
        onActionDone?.({ ...user, relationshipStatus: "none", friendshipId: null });
    };

    const handleMessage = () => {
        const storeUser = users.find((u) => u._id.toString() === user._id.toString());
        if (storeUser) {
            selectUser(storeUser);
            onClose();
        }
    };

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

                        <Button size="sm" style={{ backgroundColor: "#04263D", border: "none" }} onClick={handleSendRequest} >
                            <UserRoundPlus size={15} className="me-1" />
                            Add Friend
                        </Button>
                    )}

                    {/* Cancel sent request */}
                    {user.relationshipStatus === "pending_sent" && (

                        <Button size="sm" variant="outline-secondary" onClick={handleCancel} >
                            <Ban size={15} className="me-1" />
                            Cancel Request
                        </Button>
                    )}

                    {user.relationshipStatus === "pending_received" && (

                        <>
                            <Button size="sm" variant="outline-primary" onClick={handleAccept}>
                                <Check size={15} className="me-1" />
                                Accept
                            </Button>

                            <Button size="sm" variant="outline-danger" onClick={handleReject}>
                                <X size={15} className="me-1" />
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

                            <Button size="sm" variant="outline-danger" onClick={handleUnfriend} >
                                <UserRoundMinus size={15} className="me-1" />
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