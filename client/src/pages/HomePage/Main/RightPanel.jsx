import { socket } from "../../../lib/socket";

import { useEffect, useCallback } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { UserRoundPlus, Check, X } from "lucide-react";

import { useFriendStore } from "../../../store/useFriendStore";
import { useMessageStore } from "../../../store/useMessageStore";

// Helper — generates initials avatar when no profile pic
const InitialsAvatar = ({ name, size = 36 }) => {

    const initials = name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
    return (

        <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
                width: size,
                height: size,
                backgroundColor: "#04263D",
                color: "#ffffff",
                fontSize: size * 0.35,
                fontWeight: "bold",
            }}
        >
            {initials}
        </div>

    );

};

const RightPanel = () => {

    const {
        nonFriends,
        pendingRequests,
        fetchNonFriends,
        fetchPendingRequests,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        initializeFriendSocket,
    } = useFriendStore();

    const { fetchUsers } = useMessageStore();

    useEffect(() => {
        fetchNonFriends();
        fetchPendingRequests();
    }, []);

    // Wire up socket listeners for live friend events
    useEffect(() => {

        const { handleFriendRequestReceived, handleFriendRequestAccepted } = initializeFriendSocket();

        const onAccepted = (data) => handleFriendRequestAccepted(data, fetchUsers);

        socket.on("friendRequestReceived", handleFriendRequestReceived);
        socket.on("friendRequestAccepted", onAccepted);

        return () => {
            socket.off("friendRequestReceived", handleFriendRequestReceived);
            socket.off("friendRequestAccepted", onAccepted);
        };

    }, []);

    const handleAccept = useCallback((requestId) => {
        acceptFriendRequest(requestId, fetchUsers);
    }, [acceptFriendRequest, fetchUsers]);

    return (

        <div className="d-flex flex-column gap-3">

            {/* Incoming friend requests */}
            {pendingRequests.length > 0 && (

                <Card className="border-0 shadow-sm">

                    <Card.Body className="p-3">

                        <div className="d-flex align-items-center gap-2 mb-3">

                            <Card.Title className="mb-0" style={{ fontSize: "0.95rem", color: "#04263D" }}>
                                Friend Requests
                            </Card.Title>

                            <Badge pill style={{ backgroundColor: "#dc3545", fontSize: "0.65rem" }} >
                                {pendingRequests.length}
                            </Badge>

                        </div>

                        <ListGroup variant="flush">

                            {pendingRequests.map((req) => (

                                <ListGroup.Item key={req._id} className="d-flex align-items-center gap-2 px-0 py-2" style={{ borderColor: "#f0f0f0" }} >

                                    <InitialsAvatar name={req.requester.fullName} />

                                    <div className="flex-grow-1 overflow-hidden">

                                        <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", color: "#04263D" }} >
                                            {req.requester.fullName}
                                        </div>

                                        {req.requester.jobTitle && (

                                            <div className="text-muted text-truncate" style={{ fontSize: "0.72rem" }} >
                                                {req.requester.jobTitle}
                                            </div>

                                        )}

                                    </div>

                                    <div className="d-flex gap-2 flex-shrink-0">

                                        <div
                                            role="button"
                                            title="Accept"
                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: 28, height: 28,
                                                backgroundColor: "#d4edda",
                                                transition: "background-color 0.2s",
                                            }}
                                            onClick={() => handleAccept(req._id)}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b8ddc4"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#d4edda"}
                                        >

                                            <Check size={15} color="#198754" />

                                        </div>

                                        <div
                                            role="button"
                                            title="Reject"
                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: 28, height: 28,
                                                backgroundColor: "#f8d7da",
                                                transition: "background-color 0.2s",
                                            }}
                                            onClick={() => rejectFriendRequest(req._id)}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1b0b7"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8d7da"}
                                        >

                                            <X size={15} color="#dc3545" />

                                        </div>

                                    </div>

                                </ListGroup.Item>

                            ))}

                        </ListGroup>

                    </Card.Body>

                </Card>
            )}

            {/* People you may know */}
            <Card className="border-0 shadow-sm">

                <Card.Body className="p-3">

                    <Card.Title className="mb-3" style={{ fontSize: "0.95rem", color: "#04263D" }} >
                        People you may know
                    </Card.Title>

                    <ListGroup variant="flush">

                        {nonFriends.length === 0 ? (

                            <p className="text-muted mb-0" style={{ fontSize: "0.82rem" }}>
                                No suggestions available.
                            </p>

                        ) : (

                            nonFriends.map((user) => (

                                <ListGroup.Item key={user._id} className="d-flex align-items-center gap-2 px-0 py-2" style={{ borderColor: "#F0F0F0" }} >

                                    <InitialsAvatar name={user.fullName} />

                                    <div className="flex-grow-1 overflow-hidden">

                                        <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", color: "#04263D" }} >
                                            {user.fullName}
                                        </div>

                                        {user.jobTitle && (

                                            <div className="text-muted text-truncate" style={{ fontSize: "0.72rem" }} >
                                                {user.jobTitle}
                                            </div>

                                        )}

                                        {user.location && (

                                            <div className="text-truncate" style={{ fontSize: "0.68rem", color: "#AAAAAA" }} >
                                                {user.location}
                                            </div>
                                        )}

                                    </div>

                                    <div
                                        role="button"
                                        title="Add friend"
                                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{
                                            width: 32, height: 32,
                                            backgroundColor: "#04263D",
                                            transition: "background-color 0.2s",
                                        }}
                                        onClick={() => sendFriendRequest(user._id)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#063d5c"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#04263D"}
                                    >

                                        <UserRoundPlus size={16} color="#ffffff" />

                                    </div>

                                </ListGroup.Item>

                            ))

                        )}

                    </ListGroup>

                </Card.Body>
                
            </Card>

        </div>
    );
};

export default RightPanel;