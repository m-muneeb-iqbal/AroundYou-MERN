import { useEffect } from "react";

import { UserRoundPlus, Badge, Check, X } from "lucide-react";
import { Card, ListGroup } from "react-bootstrap";
import { useFriendStore } from "../../../store/useFriendStore";

const RightPanel = () => {

    const {
        nonFriends,
        pendingRequests,
        fetchNonFriends,
        fetchPendingRequests,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
    } = useFriendStore();

    useEffect(() => {

        fetchNonFriends();
        fetchPendingRequests();

    }, []);

    return (

        <div className="d-flex flex-column gap-3">

            {/* Incoming friend requests */}
            {pendingRequests.length > 0 && (
                <Card style={{ width: "18rem" }}>
                    <Card.Body>

                        <Card.Title className="d-flex align-items-center gap-2">
                            Friend Requests
                            <Badge bg="danger" pill>{pendingRequests.length}</Badge>
                        </Card.Title>

                        <ListGroup variant="flush">
                            {pendingRequests.map((req) => (
                                <ListGroup.Item
                                    key={req._id}
                                    className="d-flex justify-content-between align-items-center px-0"
                                >
                                    <div>
                                        <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                                            {req.requester.fullName}
                                        </div>
                                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                            {req.requester.jobTitle}
                                        </span>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <Check
                                            size={20}
                                            color="#198754"
                                            role="button"
                                            title="Accept"
                                            onClick={() => acceptFriendRequest(req._id)}
                                        />
                                        <X
                                            size={20}
                                            color="#dc3545"
                                            role="button"
                                            title="Reject"
                                            onClick={() => rejectFriendRequest(req._id)}
                                        />
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                    </Card.Body>
                </Card>
            )}

            {/* People you may know */}
            <Card style={{ width: "18rem" }}>
                <Card.Body>

                    <Card.Title>People you may know</Card.Title>

                    <ListGroup variant="flush">
                        {nonFriends.length === 0 ? (
                            <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                                No suggestions available.
                            </p>
                        ) : (
                            nonFriends.map((user) => (
                                <ListGroup.Item
                                    key={user._id}
                                    className="d-flex justify-content-between align-items-center px-0"
                                >
                                    <div>
                                        <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                                            {user.fullName}
                                        </div>
                                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                            {user.jobTitle}
                                        </span>
                                    </div>

                                    <UserRoundPlus
                                        size={20}
                                        color="#04263D"
                                        role="button"
                                        title="Add friend"
                                        onClick={() => sendFriendRequest(user._id)}
                                    />
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