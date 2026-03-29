import { useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useFriendStore } from "../../store/useFriendStore";
import { useToast } from "../../context/ToastContext";
import PersonCard from "../../components/friends/PersonCard";

const RightPanel = ({ isLoading }) => {

    const { nonFriends, sendFriendRequest, sentRequests } = useFriendStore();
    const { showToast } = useToast();
    const [loadingUserId, setLoadingUserId] = useState(null);

    const handleAdd = async (username, fullName) => {
        setLoadingUserId(username);
        try {
            await sendFriendRequest(username);
            showToast(`Friend request sent to ${fullName}!`, "success", "Friend Request Sent");
        } catch (err) {
            if (err.response?.status !== 400) {
                showToast("Failed to send request. Please try again.", "danger", "Error");
            }
        } finally {
            setLoadingUserId(null);
        }
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">

                <Card.Title className="mb-3" style={{ fontSize: "0.95rem", color: "#04263D" }}>
                    People you may know
                </Card.Title>

                <ListGroup variant="flush">

                    {isLoading ? (

                        Array.from({ length: 4 }).map((_, i) => (
                            <PersonCard key={i} isLoading={true} />
                        ))

                    ) : nonFriends.length === 0 ? (

                        <p className="text-muted mb-0" style={{ fontSize: "0.82rem" }}>
                            No suggestions available.
                        </p>

                    ) : (

                        nonFriends.map((user) => (
                            <PersonCard
                                key={user.username}
                                user={user}
                                onAdd={() => handleAdd(user.username, user.fullName)}
                                isLoading={false}
                                isPending={sentRequests.includes(user.username)}
                                isAdding={loadingUserId === user.username}
                            />
                        ))

                    )}

                </ListGroup>

            </Card.Body>
        </Card>
    );
};

export default RightPanel;