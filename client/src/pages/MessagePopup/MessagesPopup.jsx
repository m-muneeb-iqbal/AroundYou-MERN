import { useState, useRef, useEffect } from "react";

import { Card, Form, Button, ListGroup, Col } from "react-bootstrap";
import { SendHorizonal, X } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";

import { normalizeSenderId } from "../../lib/utils";

const MessageStatus = ({ status }) => {

    const bars = [
        { height: 6, delay: "0s" },
        { height: 10, delay: "0.15s" },
        { height: 14, delay: "0.3s" },
    ];

    const getBarColor = (barIndex) => {

        // Dim but visible color for unlit bars
        const unlit = "#CCCCCC";
        const lit = "#04263D";
        const seen = "#020f18";

        if (status === "sending") return unlit;

        if (status === "sent") {
            return barIndex === 0 ? lit : unlit;
        }

        if (status === "delivered") {
            return barIndex <= 1 ? lit : unlit;
        }

        if (status === "seen") {
            return seen; // all three bars fully lit in accent blue
        }

        return unlit;
    };

    const isSending = status === "sending";

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "flex-end",
                gap: "2px",
                marginLeft: "6px",
                verticalAlign: "middle",
                opacity: isSending ? 0.5 : 1,
                animation: isSending ? "pulse 1.2s ease-in-out infinite" : "none",
            }}
        >
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
            `}</style>

            {bars.map((bar, i) => (
                <span
                    key={i}
                    style={{
                        width: "3px",
                        height: `${bar.height}px`,
                        borderRadius: "2px",
                        backgroundColor: isSending ? "#CCCCCC" : getBarColor(i),
                        border: isSending ? "1px solid #CCCCCC" : "none",
                        transition: "background-color 0.3s ease",
                        display: "block",
                    }}
                />
            ))}
        </span>
    );
};

const formatMessageTime = (dateStr) => {

    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (isYesterday) {
        return "Yesterday";
    } else {
        return date.toLocaleDateString([], { day: "2-digit", month: "short" });
    }

};

const MessagesPopup = ({ onClose }) => {

    const {

        users,
        selectedUser,
        messages,
        fetchUsers,
        selectUser,
        sendMessage,
        initializeSocket,
        handleCloseConversation,

    } = useMessageStore();   

    // Fetch users on mount
    useEffect(() => {

        fetchUsers();

    }, []);

    
    // Initialize socket when user is available
    const { authUser } = useAuthStore();
    useEffect(() => {
        if (authUser?._id) {
            const cleanup = initializeSocket(authUser._id);
            return cleanup;
        }
    }, [authUser]);

    // Set logged in user
    const { setAuthUser } = useMessageStore();
    useEffect(() => {

        if (authUser?._id) {
            setAuthUser(authUser);
        }

    }, [authUser]);

    // Scroll to bottom on new messages
    const messagesEndRef = useRef(null);
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    }, [messages]);

    //Send message
    const [message, setMessage] = useState("");
    const handleSend = (e) => {

        e.preventDefault();
        if (!message.trim() || !selectedUser) return;

        sendMessage({
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: message,
        });

        setMessage(""); // wait for server to push message back

        
    };

    return (

        <Card border="light" className="position-fixed d-flex flex-column shadow" style={{ bottom: "20px", right: "20px", width: "320px", height: "450px", zIndex: "1000" }}>
    
            <Card.Header className="d-flex justify-content-between align-items-center fw-bold">

                <span>{selectedUser ? selectedUser.fullName : "AroundYou"}</span>
                <X role="button" onClick={() => { handleCloseConversation(); onClose?.(); }} />

            </Card.Header>
    
            {!selectedUser ? (

                <ListGroup variant="flush" style={{ overflowY: "auto", flex: 1 }}>

                    {users.map((user) => (

                        <ListGroup.Item key={user._id} action style={{ padding: "0.5rem 1rem" }} onClick={() => selectUser(user)}>

                            <Col xs={12} style={{ padding: 0 }}>

                                <div className="d-flex justify-content-between align-items-center">

                                    <span style={{ fontSize: "0.9rem", color: "#000000", fontWeight: user.unreadCount > 0 ? "bold" : "normal" }}>
                                        {user.fullName}
                                    </span>

                                    <span style={{ fontSize: "0.65rem", color: user.unreadCount > 0 ? "#04263D" : "#898C8F", fontWeight: user.unreadCount > 0 ? "bold" : "normal", whiteSpace: "nowrap" }}>
                                        {formatMessageTime(user.lastMessage?.createdAt)}
                                    </span>

                                </div>

                                <div className="d-flex justify-content-between align-items-center">

                                    <span style={{ fontSize: "0.7rem", color: user.unreadCount > 0 ? "#000000" : "#898C8F", fontWeight: user.unreadCount > 0 ? "bold" : "normal", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "200px" }}>
                                        {user.lastMessage?.text || "Start conversation"}
                                    </span>

                                    {user.unreadCount > 0 && (

                                        <span className="badge" style={{ backgroundColor: "#04263D", fontSize: "0.6rem", borderRadius: "50%" }}>
                                            {user.unreadCount}
                                        </span>

                                    )}

                                </div>

                            </Col>

                        </ListGroup.Item>

                    ))}

                </ListGroup>

            ) : (

                <>
                    <Card.Body className="d-flex flex-column p-2" style={{ flex: 1, overflowY: "auto", gap: "0.5rem" }}>

                        {messages.map((msg, index) => {

                            const isSender = normalizeSenderId(msg.senderId) === authUser._id?.toString();
    
                            return (

                                <div key={`${msg._id}-${index}`} style={{ display: "flex", flexDirection: "column", alignItems: isSender ? "flex-end" : "flex-start" }}>

                                    <div style={{ padding: "8px 12px", borderRadius: "15px", maxWidth: "75%", backgroundColor: isSender ? "#04263D" : "#302A2A", color: "#FFFFFF", fontSize: "0.9rem" }}>
                                        {msg.text}
                                    </div>
    
                                    {/*Status indicator — only shown for sender */}
                                    {isSender && (

                                        <div style={{ display: "flex", alignItems: "center", marginTop: "3px", gap: "4px" }}>

                                            <span style={{ fontSize: "0.6rem", color: "#898C8F" }}>

                                                {formatMessageTime(msg.createdAt)}
                                            </span>

                                            <MessageStatus status={msg.status || "sent"} />
                                         </div>

                                    )}
    
                                    {/* Timestamp */}
                                    {!isSender && (

                                        <span style={{ fontSize: "0.6rem", color: "#898C8F", marginTop: "3px" }}>
                                            {formatMessageTime(msg.createdAt)}
                                        </span>

                                    )}

                                </div>

                            );

                        })}

                        <div ref={messagesEndRef} />

                    </Card.Body>
    
                    <Card.Footer>

                        <Form onSubmit={handleSend} className="d-flex gap-2">

                            <Form.Control type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />

                            <Button type="submit" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                                <SendHorizonal color="#04263D" size={30} />
                            </Button>

                        </Form>

                    </Card.Footer>

                </>

            )}
            
        </Card>

    );
    
};

export default MessagesPopup;