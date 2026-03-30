import { useState } from "react";
import { ListGroup, Spinner } from "react-bootstrap";
import { Check, X } from "lucide-react";

import PlaceholderAvatar from "../common/PlaceholderAvatar";
import ActionButton from "../common/ActionButton";

const FriendRequestItem = ({ request, onAccept, onReject }) => {

    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const handleAccept = async () => {
        setIsAccepting(true);
        try { await onAccept(); } finally { setIsAccepting(false); }
    };

    const handleReject = async () => {
        setIsRejecting(true);
        try { await onReject(); } finally { setIsRejecting(false); }
    };

    const isBusy = isAccepting || isRejecting;

    return (

        <ListGroup.Item className="d-flex align-items-center gap-2 px-0 py-2" style={{ borderColor: "#f0f0f0" }} >

            <PlaceholderAvatar name={request.requester.fullName} profilePic={request.requester.profilePic} size={36} />

            <div className="flex-grow-1 overflow-hidden">

                <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", color: "#04263D" }}>
                    {request.requester.fullName}
                </div>

                {request.requester.jobTitle && (

                    <div className="text-muted text-truncate" style={{ fontSize: "0.72rem" }}>
                        {request.requester.jobTitle}
                    </div>

                )}

            </div>

            <div className="d-flex gap-2 flex-shrink-0">

                <ActionButton
                    color={isAccepting ? "#d4edda" : "#d4edda"}
                    hoverColor="#b8ddc4"
                    onClick={isBusy ? undefined : handleAccept}
                    title="Accept"
                    disabled={isBusy}
                >
                    {isAccepting
                        ? <Spinner animation="border" size="sm" style={{ width: 14, height: 14, borderWidth: 2, color: "#198754" }} />
                        : <Check size={15} color="#198754" />
                    }
                </ActionButton>

                <ActionButton
                    color={isRejecting ? "#f8d7da" : "#f8d7da"}
                    hoverColor="#f1b0b7"
                    onClick={isBusy ? undefined : handleReject}
                    title="Reject"
                    disabled={isBusy}
                >
                    {isRejecting
                        ? <Spinner animation="border" size="sm" style={{ width: 14, height: 14, borderWidth: 2, color: "#dc3545" }} />
                        : <X size={15} color="#dc3545" />
                    }
                </ActionButton>

            </div>

        </ListGroup.Item>

    );

};

export default FriendRequestItem;