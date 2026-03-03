import { io } from "socket.io-client";

import { useState, useRef, useEffect } from "react";

import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { SendHorizonal, X } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";

const socket = io ("http://localhost:5000", {

    transports: ["websocket", "polling"],

});

const MessagesPopup = ({ onClose }) => {

    const [users, setUsers] = useState([]);

    // Fetch users with last message
    useEffect(() => {

        const fetchUsers = async () => {

            const res = await fetch(
            "http://localhost:5000/api/message/users",
            { credentials: "include" }
            );

            const data = await res.json();
            setUsers(data); // now this is conversations

        };

        fetchUsers();
    }, []);

    const { authUser } = useAuthStore();
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    
    // Mark user online & listen for messages
    useEffect(() => {

        if (!authUser) return;
        
        socket.emit("userOnline", authUser._id);
        
        const handleReceiveMessage = (msg) => {
            if ( selectedUser && (msg.senderId === selectedUser._id || msg.senderId === authUser._id) ) {

                setMessages((prev) => {
                    if (prev.some((m) => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });

            }

            setUsers((prev) =>
                prev.map((conv) =>
                    conv._id === msg.conversationId
                        ? { ...conv, lastMessage: msg }
                        : conv
                )
            );
        };
        
        const handleMessagesRead = (conversationId) => {

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.conversationId === conversationId
                        ? { ...msg, readBy: [...new Set([...msg.readBy, selectedUser?._id])] }
                        : msg
                )
            );

        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("messagesRead", handleMessagesRead);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("messagesRead", handleMessagesRead);
        };

    }, [authUser, selectedUser]);

    // Load messages for selected user
    useEffect(() => {

        const loadMessages = async () => {

            if (!selectedUser) return;

            const res = await fetch(
                `http://localhost:5000/api/message/${selectedUser._id}?page=1&limit=20`,
                { credentials: "include" }
            );

            const data = await res.json();
            setMessages(data);

            if (data.length > 0 && data[0].conversationId) {

                await fetch(
                    `http://localhost:5000/api/message/read/${data[0].conversationId}`,
                    {
                        method: "PUT",
                        credentials: "include",
                    }
                );

            }
        };

        loadMessages();
    }, [selectedUser]);

    const [message, setMessage] = useState("");

    const handleSend = (e) => {

        e.preventDefault();
        if (!message.trim() || !selectedUser) return;

        socket.emit("sendMessage", {

            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: message,

        });

        setMessage(""); // do not manually add to messages, wait for server

    };

    const messagesEndRef = useRef(null);
    
    // Scroll to bottom
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    }, [messages]);


    return (

        <Card border="light" className="position-fixed d-flex flex-column shadow" style={{ bottom: "20px", right: "20px", width: "320px", height: "450px", zIndex: "1000", }}>

            <Card.Header className="d-flex justify-content-between align-items-center fw-bold" >

                <span>{selectedUser ? selectedUser.fullName : "AroundYou"}</span>
                <X role="button" onClick={onClose} />

            </Card.Header>
        
            {!selectedUser ? (

                <ListGroup variant="flush" style={{ overflowY: "auto", flex: 1 }}>

                    {users.map((user) => (

                        <ListGroup.Item key={user._id} action onClick={() => setSelectedUser(user)}>

                            <div style={{ fontWeight: "bold" }}>{user.fullName}</div>
                            <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>

                                <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>

                                    {user.lastMessage?.text || "Start conversation"}

                                </div>

                                {user.unreadCount > 0 && (
                                    <span className="badge bg-danger">
                                        {user.unreadCount}
                                    </span>
                                )}

                            </div>

                        </ListGroup.Item>

                    ))}

                </ListGroup>

            ) : (

                <>
                    <Card.Body className="d-flex flex-column p-2" style={{ flex: 1, overflowY: "auto", gap: "0.5rem", }} >

                        {messages.map((msg) => (

                            <div key={msg._id} style={{ padding: "8px 12px", borderRadius: "15px",  maxWidth: "75%", alignSelf: msg.senderId === authUser._id ? "flex-end" : "flex-start", backgroundColor: msg.senderId === authUser._id ? "#04263D" : "#302A2A", color: msg.senderId === authUser._id ? "#FFFFFF" : "#FFFFFF", fontSize: "0.9rem", }} >
                                {msg.text}
                            </div>

                        ))}

                        <div ref={messagesEndRef} />

                    </Card.Body>
        
                    <Card.Footer>

                        <Form onSubmit={handleSend} className="d-flex gap-2">

                            <Form.Control type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                            <Button type="submit"     style={{ background: "none", border: "none", padding: 0, cursor: "pointer", }}> 
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