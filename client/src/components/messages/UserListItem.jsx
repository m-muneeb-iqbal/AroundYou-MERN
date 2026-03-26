import { ListGroup, Col } from "react-bootstrap";
import { formatMessageTime } from "../../lib/utils";

const UserListItem = ({ user, onSelect }) => {

    const hasUnread = user.unreadCount > 0;

    return (

        <ListGroup.Item action onClick={() => onSelect(user)} className="px-3 py-2 gap-1">

            <Col className="py-2">

                <div className="d-flex justify-content-between align-items-center">

                    <span className={hasUnread ? "fw-bold" : ""}style={{ fontSize: "0.9rem" }} >
                        {user.fullName}
                    </span>

                    <span className={`text-nowrap ${hasUnread ? "fw-bold" : "text-secondary"}`} style={{ fontSize: "0.65rem", color: hasUnread ? "#04263D" : undefined, }} >
                        {formatMessageTime(user.lastMessage?.createdAt)}
                    </span>

                </div>

                <div className="d-flex justify-content-between align-items-center">

                    <span className={`text-truncate ${hasUnread ? "fw-bold" : "text-secondary"}`} style={{ fontSize: "0.7rem", maxWidth: "200px", color: hasUnread ? "#000000" : undefined, }} >
                        {user.lastMessage?.text || "Start conversation"}
                    </span>

                    {hasUnread && (

                        <span className="badge rounded-circle" style={{ backgroundColor: "#04263D", fontSize: "0.6rem" }} >
                            {user.unreadCount}
                        </span>
                        
                    )}

                </div>

            </Col>

        </ListGroup.Item>

    );

};

export default UserListItem;