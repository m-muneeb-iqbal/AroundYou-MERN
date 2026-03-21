import { Badge } from "react-bootstrap";

import InitialsAvatar from "../../common/InitialsAvatar";

export const roleBadgeStyle = (role) => {

    if (role === "SuperAdmin") return { backgroundColor: "#6F42C1", color: "#FFFFFF" };
    if (role === "Admin") return { backgroundColor: "#04263D", color: "#FFFFFF" };
    return { backgroundColor: "#E0E0E0", color: "#555555" };

};

const DrawerHeader = ({ user }) => (

    <div className="d-flex align-items-center gap-3 w-100">

        <InitialsAvatar name={user.fullName} profilePic={user.profilePic} size={42} />
        <div className="flex-grow-1 overflow-hidden">

            <div className="fw-bold text-truncate" style={{ color: "#04263D" }}>
                {user.fullName}
            </div>

            <div className="text-muted text-truncate" style={{ fontSize: "0.78rem" }}>
                {user.email}
            </div>

        </div>

        <Badge pill bg="none" style={{ ...roleBadgeStyle(user.role), fontSize: "0.65rem", flexShrink: 0 }}>
            {user.role}
        </Badge>

    </div>

);

export default DrawerHeader;