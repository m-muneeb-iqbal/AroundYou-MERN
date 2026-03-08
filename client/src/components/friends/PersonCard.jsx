import { ListGroup } from "react-bootstrap";
import { UserRoundPlus, } from "lucide-react";

import InitialsAvatar from "../common/InitialsAvatar";
import ActionButton from "../common/ActionButton";

const PersonCard = ({ user, onAdd }) => (

    <ListGroup.Item className="d-flex align-items-center gap-2 px-0 py-2" style={{ borderColor: "#F0F0F0" }} >

        <InitialsAvatar name={user.fullName} profilePic={user.profilePic}/>

        <div className="flex-grow-1 overflow-hidden">

            <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", color: "#04263D" }}>
                {user.fullName}
            </div>

            {user.jobTitle && (

                <div className="text-muted text-truncate" style={{ fontSize: "0.72rem" }}>
                    {user.jobTitle}
                </div>

            )}

            {user.location && (

                <div className="text-truncate" style={{ fontSize: "0.68rem", color: "#AAAAAA" }}>
                    {user.location}
                </div>

            )}

        </div>

        <ActionButton color="#04263D" hoverColor="#063D5C" onClick={onAdd} title="Add friend" size={32} >
            <UserRoundPlus size={16} color="#FFFFFF" />
        </ActionButton>

    </ListGroup.Item>

);

export default PersonCard;