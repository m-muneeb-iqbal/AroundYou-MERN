import { ListGroup, Spinner } from "react-bootstrap";
import { UserRoundPlus, Clock } from "lucide-react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import PlaceholderAvatar from "../common/PlaceholderAvatar";
import ActionButton from "../common/ActionButton";

const PersonCard = ({ user, onAdd, isLoading, isPending, isAdding }) => (

    <ListGroup.Item className="d-flex align-items-center gap-2 px-0 py-2" style={{ borderColor: "#F0F0F0" }}>

        {isLoading ? (
            <Skeleton circle width={36} height={36} className="flex-shrink-0" />
        ) : (
            <PlaceholderAvatar name={user.fullName} profilePic={user.profilePic} size={36} />
        )}

        <div className="flex-grow-1 overflow-hidden">

            <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", color: "#04263D" }}>
                {isLoading ? <Skeleton width="65%" /> : user.fullName}
            </div>

            <div className="text-muted text-truncate" style={{ fontSize: "0.72rem" }}>
                {isLoading ? <Skeleton width="45%" /> : user.headline}
            </div>

            <div className="text-truncate" style={{ fontSize: "0.68rem", color: "#AAAAAA" }}>
                {isLoading ? <Skeleton width="35%" /> : user.location}
            </div>

        </div>

        {isLoading ? (
            <Skeleton circle width={36} height={36} className="flex-shrink-0" />
        ) : isPending ? (
            <div
                className="d-flex align-items-center gap-1 flex-shrink-0 rounded px-2 py-1"
                style={{
                    backgroundColor: "#F0F0F0",
                    color: "#888888",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    cursor: "default",
                    userSelect: "none",
                }}
                title="Request sent"
            >
                <Clock size={13} color="#888888" />
                Pending
            </div>
        ) : isAdding ? (
            <ActionButton color="#04263D" hoverColor="#063D5C" onClick={undefined} title="Sending…" size={32} disabled>
                <Spinner animation="border" size="sm" style={{ width: 14, height: 14, borderWidth: 2, color: "#FFFFFF" }} />
            </ActionButton>
        ) : (
            <ActionButton color="#04263D" hoverColor="#063D5C" onClick={onAdd} title="Add friend" size={32}>
                <UserRoundPlus size={16} color="#FFFFFF" />
            </ActionButton>
        )}

    </ListGroup.Item>

);

export default PersonCard;