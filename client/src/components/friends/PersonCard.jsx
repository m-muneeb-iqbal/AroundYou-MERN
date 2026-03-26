import { ListGroup } from "react-bootstrap";
import { UserRoundPlus } from "lucide-react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import InitialsAvatar from "../common/InitialsAvatar";
import ActionButton from "../common/ActionButton";

const PersonCard = ({ user, onAdd, isLoading }) => (

    <ListGroup.Item className="d-flex align-items-center gap-2 px-0 py-2" style={{ borderColor: "#F0F0F0" }}>

        {isLoading ? (
            <Skeleton circle width={36} height={36} className="flex-shrink-0" />
        ) : (
            <InitialsAvatar name={user.fullName} profilePic={user.profilePic} />
        )}

        <div className="flex-grow-1 overflow-hidden">

            <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", color: "#04263D" }}>
                {isLoading ? <Skeleton width="65%" /> : user.fullName}
            </div>

            <div className="text-muted text-truncate" style={{ fontSize: "0.72rem" }}>
                {isLoading ? <Skeleton width="45%" /> : user.designation}
            </div>

            <div className="text-truncate" style={{ fontSize: "0.68rem", color: "#AAAAAA" }}>
                {isLoading ? <Skeleton width="35%" /> : user.location}
            </div>

        </div>

        {isLoading ? (
            <Skeleton circle width={36} height={36} className="flex-shrink-0" />
        ) : (
            <ActionButton color="#04263D" hoverColor="#063D5C" onClick={onAdd} title="Add friend" size={32}>
                <UserRoundPlus size={16} color="#FFFFFF" />
            </ActionButton>
        )}

    </ListGroup.Item>

);

export default PersonCard;