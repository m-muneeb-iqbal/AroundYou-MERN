import { socket } from "../../lib/socket";

import { useEffect, useCallback } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";

import { useFriendStore } from "../../store/useFriendStore";
import { useMessageStore } from "../../store/useMessageStore";

import FriendRequestItem from "../../components/friends/FriendRequestItem";
import PersonCard from "../../components/friends/PersonCard";

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

            {pendingRequests.length > 0 && (

                <Card className="border-0 shadow-sm">

                    <Card.Body className="p-3">

                        <div className="d-flex align-items-center gap-2 mb-3">

                            <Card.Title className="mb-0" style={{ fontSize: "0.95rem", color: "#04263D" }}>
                                Friend Requests
                            </Card.Title>

                            <Badge pill style={{ backgroundColor: "#dc3545", fontSize: "0.65rem" }}>
                                {pendingRequests.length}
                            </Badge>

                        </div>

                        <ListGroup variant="flush">

                            {pendingRequests.map((req) => (

                                <FriendRequestItem
                                    key={req._id}
                                    request={req}
                                    onAccept={() => handleAccept(req._id)}
                                    onReject={() => rejectFriendRequest(req._id)}
                                />
                            ))}

                        </ListGroup>

                    </Card.Body>

                </Card>
            )}

            <Card className="border-0 shadow-sm">

                <Card.Body className="p-3">

                    <Card.Title className="mb-3" style={{ fontSize: "0.95rem", color: "#04263D" }}>
                        People you may know
                    </Card.Title>

                    <ListGroup variant="flush">

                        {nonFriends.length === 0 ? (

                            <p className="text-muted mb-0" style={{ fontSize: "0.82rem" }}>
                                No suggestions available.
                            </p>

                        ) : (

                            nonFriends.map((user) => (

                                <PersonCard
                                    key={user._id}
                                    user={user}
                                    onAdd={() => sendFriendRequest(user._id)}
                                />

                            ))

                        )}

                    </ListGroup>

                </Card.Body>

            </Card>

        </div>
    );
};

export default RightPanel;