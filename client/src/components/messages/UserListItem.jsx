import { ListGroup, Col } from "react-bootstrap";
import { formatMessageTime } from "../../lib/utils";

import PlaceholderAvatar from "../common/PlaceholderAvatar";
import MessageStatus from "./MessageStatus";

const UserListItem = ({ user, onSelect }) => {

    const hasUnread = user.unreadCount > 0;

    return (

        <ListGroup.Item action onClick={() => onSelect(user)} className="px-3 py-2">

            <div className="d-flex align-items-center gap-3">

                {/* Avatar */}
                <PlaceholderAvatar name={user.fullName} profilePic={user.profilePic} size={45} />

                {/* User Info */}
                <Col className="py-0">

                    <div className="d-flex justify-content-between align-items-center">

                        <span className={hasUnread ? "fw-bold" : ""} style={{ fontSize: "0.9rem" }} >
                            {user.fullName}
                        </span>

                        <span className={`text-nowrap ${hasUnread ? "fw-bold" : "text-secondary"}`} style={{ fontSize: "0.65rem", color: hasUnread ? "#04263D" : undefined, }} >
                            {formatMessageTime(user.lastMessage?.createdAt)}
                        </span>

                    </div>

                    <div className="d-flex justify-content-between align-items-center gap-2">

                        <span className={`text-truncate ${hasUnread ? "fw-bold" : "text-secondary"}`} style={{ fontSize: "0.7rem", maxWidth: "200px", color: hasUnread ? "#000000" : undefined, }} >
                            {user.lastMessage?.text || "Start conversation"}
                        </span>

                        <div className="d-flex align-items-center gap-2" style={{ flexShrink: 0 }}>
                            {user.lastMessage?.isMine && user.lastMessage?.status && (
                                <MessageStatus status={user.lastMessage.status} />
                            )}
                            {hasUnread && (

                                <span className="badge rounded-circle" style={{ backgroundColor: "#04263D", fontSize: "0.6rem", flexShrink: 0 }} >
                                    {user.unreadCount}
                                </span>
                                
                            )}
                        </div>

                    </div>

                </Col>

            </div>

        </ListGroup.Item>

    );

};

export default UserListItem;