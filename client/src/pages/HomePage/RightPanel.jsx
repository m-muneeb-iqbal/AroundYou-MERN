import { socket } from "../../lib/socket";
import { useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";

import { useFriendStore } from "../../store/useFriendStore";
import { useMessageStore } from "../../store/useMessageStore";
import PersonCard from "../../components/friends/PersonCard";

const RightPanel = () => {

    const {
        nonFriends,
        fetchNonFriends,
        sendFriendRequest,
        initializeFriendSocket,
    } = useFriendStore();

    const { fetchUsers } = useMessageStore();

    useEffect(() => {
        fetchNonFriends();
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

    return (

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

    );
};

export default RightPanel;