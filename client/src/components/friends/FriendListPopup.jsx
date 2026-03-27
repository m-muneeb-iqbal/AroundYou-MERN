import { useState, useEffect } from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import { X, MessageCircleMore, UserRoundX } from "lucide-react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useFriendStore } from "../../store/useFriendStore";
import { useMessageStore } from "../../store/useMessageStore";
import InitialsAvatar from "../common/InitialsAvatar";
import ActionButton from "../common/ActionButton";

const FriendListPopup = ({ onClose, onOpenMessages }) => {

    const { friends, fetchFriends, unfriend } = useFriendStore();
    const { users, fetchUsers, selectUser } = useMessageStore();
    const [isLoading, setIsLoading] = useState(true);
    const [confirmUnfriendId, setConfirmUnfriendId] = useState(null);

    useEffect(() => {
        const load = async () => {
            await Promise.all([fetchFriends(), fetchUsers()]);
            setIsLoading(false);
        };
        load();
    }, [fetchFriends, fetchUsers]);

    const handleMessage = (friend) => {
        const msgUser = users.find((u) => u._id.toString() === friend._id.toString()) || friend;
        selectUser(msgUser);
        onClose();
        onOpenMessages();
    };

    const handleUnfriendConfirm = async (friendId) => {
        await unfriend(friendId);
        setConfirmUnfriendId(null);
    };

    const skeletonRows = Array.from({ length: 4 });

    return (

        <Card border="light" className="position-fixed d-flex flex-column shadow"
            style={{
                bottom: "20px",
                right: "20px",
                width: "min(360px, calc(100vw - 1.5rem))",
                height: "min(440px, calc(100vh - 6rem))",
                zIndex: "var(--z-popup, 1100)",
            }}
        >

            {/* Header */}
            <Card.Header className="d-flex align-items-center justify-content-between fw-bold">
                <span style={{ color: "#04263D" }}>Friends</span>
                <X size={18} role="button" color="#04263D" onClick={onClose} />
            </Card.Header>

            {/* Body */}
            <Card.Body className="overflow-auto p-0">

                {isLoading ? (

                    <ListGroup variant="flush">

                        {skeletonRows.map((_, i) => (

                            <ListGroup.Item key={i} className="d-flex align-items-center gap-2 px-3 py-2">

                                <Skeleton circle width={36} height={36} className="flex-shrink-0" />

                                <div className="flex-grow-1">
                                    <Skeleton width="60%" />
                                    <Skeleton width="40%" />
                                </div>

                                <Skeleton circle width={32} height={32} />
                                <Skeleton circle width={32} height={32} />

                            </ListGroup.Item>

                        ))}

                    </ListGroup>

                ) : friends.length === 0 ? (

                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted gap-2">

                        <UserRoundX size={36} color="#AAAAAA" />
                        <span style={{ fontSize: "0.85rem" }}>No friends yet.</span>

                    </div>

                ) : (

                    <ListGroup variant="flush">

                        {friends.map((friend) => (

                            <ListGroup.Item key={friend._id} className="d-flex align-items-center gap-2 px-3 py-2" style={{ borderColor: "#F0F0F0" }} >

                                <InitialsAvatar name={friend.fullName} profilePic={friend.profilePic} />

                                <div className="flex-grow-1 overflow-hidden">

                                    <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", color: "#04263D" }}>
                                        {isLoading ? <Skeleton width="65%" /> : friend.fullName}
                                    </div>

                                    <div className="text-muted text-truncate" style={{ fontSize: "0.72rem" }}>
                                        {isLoading ? <Skeleton width="45%" /> : friend.headline}
                                    </div>

                                    <div className="text-truncate" style={{ fontSize: "0.68rem", color: "#AAAAAA" }}>
                                        {isLoading ? <Skeleton width="35%" /> : friend.location}
                                    </div>

                                </div>

                                {/* Message */}
                                <ActionButton color="#04263D" hoverColor="#063D5C" onClick={() => handleMessage(friend)} title="Send message" size={32} >
                                    <MessageCircleMore size={15} color="#FFFFFF" />
                                </ActionButton>

                                {/* Unfriend */}
                                {confirmUnfriendId === friend._id ? (

                                    <div className="d-flex gap-1 flex-shrink-0">

                                        <Button variant="danger" style={{ fontSize: "0.68rem", padding: "2px 7px" }} onClick={() => handleUnfriendConfirm(friend._id)} >
                                            Confirm
                                        </Button>

                                        <Button variant="outline-secondary" style={{ fontSize: "0.68rem", padding: "2px 7px" }} onClick={() => setConfirmUnfriendId(null)} >
                                            Cancel
                                        </Button>
                                    </div>

                                ) : (

                                    <ActionButton color="#DC3545" hoverColor="#B02A37" onClick={() => setConfirmUnfriendId(friend._id)} title="Unfriend" size={32} >
                                        <UserRoundX size={15} color="#FFFFFF" />
                                    </ActionButton>

                                )}

                            </ListGroup.Item>

                        ))}

                    </ListGroup>

                )}

            </Card.Body>

        </Card>

    );

};

export default FriendListPopup;