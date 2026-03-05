import { formatMessageTime } from "../../lib/utils";
import MessageStatus from "./MessageStatus";

const MessageBubble = ({ msg, isSender }) => (

    <div className={`d-flex flex-column ${isSender ? "align-items-end" : "align-items-start"}`}>

        <div
            style={{
                padding: "8px 12px",
                borderRadius: "15px",
                maxWidth: "75%",
                backgroundColor: isSender ? "#04263D" : "#302A2A",
                color: "#FFFFFF",
                fontSize: "0.9rem",
            }}
        >
            {msg.text}
        </div>

        {isSender ? (

            <div className="d-flex align-items-center mt-1 gap-1">
                
                <span className="text-secondary" style={{ fontSize: "0.6rem" }}>
                    {formatMessageTime(msg.createdAt)}
                </span>

                <MessageStatus status={msg.status || "sent"} />

            </div>

        ) : (
            <span className="text-secondary mt-1" style={{ fontSize: "0.6rem" }}>
                {formatMessageTime(msg.createdAt)}
            </span>
        )}

    </div>

);

export default MessageBubble;