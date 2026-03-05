import { useState, useRef, useEffect } from "react";

import { Card, Form, Button, ListGroup, Col } from "react-bootstrap";
import { SendHorizonal, X } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";

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

            {/* Header */}
            <Card.Header className="d-flex justify-content-between align-items-center fw-bold">

                <span>{selectedUser ? selectedUser.fullName : "AroundYou"}</span>
                <X 
                    role="button" 
                    onClick={() => {
                        handleCloseConversation();
                        onClose?.();
                    }}
                />

            </Card.Header>

            {/* Users list */}
            {!selectedUser ? (

                <ListGroup variant="flush" style={{ overflowY: "auto", flex: 1 }}>

                    {users.map((user) => (

                        <ListGroup.Item key={user._id} action style={{ padding: "0.5rem 1rem" }} onClick={() => selectUser(user)}>

                            <Col xs={12} style={{ padding: 0 }}>

                                <span style={{ fontSize: "0.9rem", color: "#000000", fontWeight: user.unreadCount > 0 ? "bold" : "normal",}}>

                                    {user.fullName}

                                </span>

                                <div className="d-flex justify-content-between align-items-center">

                                    <span style={{ fontSize: "0.7rem", color: user.unreadCount > 0 ? "#000000" : "#898C8F", fontWeight: user.unreadCount > 0 ? "bold" : "normal"}}>

                                        {user.lastMessage?.text || "Start conversation"}

                                    </span>

                                    {user.unreadCount > 0 && (

                                        <span className="badge" style={{ backgroundColor: "#04263D", fontSize: "0.6rem", borderRadius: "50%", }} >
                                            
                                            {user.unreadCount || 0}

                                        </span>
                                    )}

                                </div>

                            </Col>

                        </ListGroup.Item>
                        
                    ))}

                </ListGroup>

            ) : (

                <>
                    {/* Messages view */}
                    <Card.Body className="d-flex flex-column p-2" style={{ flex: 1, overflowY: "auto", gap: "0.5rem" }}>

                        {messages.map((msg, index) => (

                            <div key={`${msg._id}-${index}`} style={{ padding: "8px 12px", borderRadius: "15px", maxWidth: "75%", alignSelf: msg.senderId === authUser._id ? "flex-end" : "flex-start", backgroundColor: msg.senderId === authUser._id ? "#04263D" : "#302A2A", color: "#FFFFFF", fontSize: "0.9rem" }}>

                                {msg.text}

                            </div>
                        ))}

                        <div ref={messagesEndRef} />

                    </Card.Body>

                    {/* Input */}
                    <Card.Footer>

                        <Form onSubmit={handleSend} className="d-flex gap-2">
                            <Form.Control type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)}/>

                            <Button type="submit" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }} >

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