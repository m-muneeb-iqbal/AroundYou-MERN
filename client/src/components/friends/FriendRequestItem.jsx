import { ListGroup } from "react-bootstrap";
import { Check, X } from "lucide-react";

import InitialsAvatar from "../common/InitialsAvatar";
import ActionButton from "../common/ActionButton";

const FriendRequestItem = ({ request, onAccept, onReject }) => (

    <ListGroup.Item className="d-flex align-items-center gap-2 px-0 py-2" style={{ borderColor: "#f0f0f0" }} >

        <InitialsAvatar name={request.requester.fullName} profilePic={request.requester.profilePic}/>

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

            <ActionButton color="#d4edda" hoverColor="#b8ddc4" onClick={onAccept} title="Accept">
                <Check size={15} color="#198754" />
            </ActionButton>

            <ActionButton color="#f8d7da" hoverColor="#f1b0b7" onClick={onReject} title="Reject">
                <X size={15} color="#dc3545" />
            </ActionButton>

        </div>

    </ListGroup.Item>
    
);

export default FriendRequestItem;