import { io } from "socket.io-client";

import { useState, useRef, useEffect } from "react";

import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { X } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";

const socket = io ("http://localhost:5000", {

    transports: ["websocket", "polling"],

});

const MessagesPopup = ({ onClose }) => {

    const { getUsers } = useMessageStore();
    const [users, setUsers] = useState([]);

    // Fetch users with last message
    useEffect(() => {

        const fetchUsers = async () => {

            const usersData = await getUsers();

            const usersWithLastMessage = await Promise.all(

                usersData.map(async (user) => {

                    const res = await fetch(
                        `http://localhost:5000/api/message/${user._id}`,
                        { credentials: "include" }
                    );

                    const msgs = await res.json();
                    const lastMessage = msgs[msgs.length - 1]?.text || "";
                    return { ...user, lastMessage };
                })

            );

            setUsers(usersWithLastMessage);

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

            // Update chat if selected user is involved
            if ( selectedUser && (msg.senderId === selectedUser._id || msg.receiverId === selectedUser._id )) {

                setMessages((prev) => {

                    if (prev.some((m) => m._id === msg._id)) return prev;
                    return [...prev, msg];

                });
            }
        
            // Update last message in sidebar
            const otherUserId = msg.senderId === authUser._id ? msg.receiverId : msg.senderId;

            setUsers((prev) =>
                prev.map((u) => (u._id === otherUserId ? { ...u, lastMessage: msg.text } : u))
            );

        };
        
        socket.on("receiveMessage", handleReceiveMessage);
        return () => socket.off("receiveMessage", handleReceiveMessage);

    }, [authUser, selectedUser]);

    // Load messages for selected user
    useEffect(() => {

        const loadMessages = async () => {

            if (!selectedUser) return;

            const res = await fetch(
                `http://localhost:5000/api/message/${selectedUser._id}`,
                { credentials: "include" }
            );

            const data = await res.json();
            setMessages(data);

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

        <Card style={styles.chatContainer}>

            <Card.Header style={styles.header}>

                <span>{selectedUser ? selectedUser.fullName : "Select a user"}</span>
                <X role="button" onClick={onClose} />

            </Card.Header>
        
            {!selectedUser ? (

                <ListGroup variant="flush" style={{ overflowY: "auto", flex: 1 }}>

                    {users.map((user) => (

                        <ListGroup.Item key={user._id} action onClick={() => setSelectedUser(user)}>

                            <div style={{ fontWeight: "bold" }}>{user.fullName}</div>
                            <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                                {user.lastMessage || "No messages yet"}
                            </div>

                        </ListGroup.Item>

                    ))}

                </ListGroup>

            ) : (

                <>
                    <Card.Body style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", padding: "8px"}} >

                        {messages.map((msg) => (

                            <div key={msg._id} style={{ padding: "8px 12px", borderRadius: "15px",  maxWidth: "75%", alignSelf: msg.senderId === authUser._id ? "flex-end" : "flex-start", backgroundColor: msg.senderId === authUser._id ? "#0d6efd" : "#e9ecef", color: msg.senderId === authUser._id ? "white" : "black", fontSize: "0.9rem", }} >
                                {msg.text}
                            </div>

                        ))}

                        <div ref={messagesEndRef} />

                    </Card.Body>
        
                    <Card.Footer>

                        <Form onSubmit={handleSend} className="d-flex gap-2">

                            <Form.Control type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                            <Button type="submit">Send</Button>
                            
                        </Form>

                    </Card.Footer>

                </>
            )}

        </Card>

    );

};

const styles = {
    chatContainer: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "320px",
        height: "450px",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "bold",
    },
};

export default MessagesPopup;