import { useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useFriendStore } from "../../store/useFriendStore";
import PersonCard from "../../components/friends/PersonCard";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const RightPanel = () => {

    const { nonFriends, fetchNonFriends, sendFriendRequest, isLoadingNonFriends } = useFriendStore();

    useEffect(() => {
        fetchNonFriends();
    }, []);

    return (

        <Card className="border-0 shadow-sm">

            <Card.Body className="p-3">

                <Card.Title className="mb-3" style={{ fontSize: "0.95rem", color: "#04263D" }}>
                    People you may know
                </Card.Title>

                <ListGroup variant="flush">

                    {isLoadingNonFriends ? (

                        <SkeletonLoader rows={3} />

                    ) : nonFriends.length === 0 ? (

                        <p className="text-muted mb-0" style={{ fontSize: "0.82rem" }}>
                            No suggestions available.
                        </p>

                    ) : (

                        nonFriends.map((user) => (

                            <PersonCard key={user._id} user={user} onAdd={() => sendFriendRequest(user._id)} />
                        ))

                    )}

                </ListGroup>

            </Card.Body>

        </Card>

    );
    
};

export default RightPanel;