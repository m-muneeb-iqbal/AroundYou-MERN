import { useState, useRef, useEffect } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { SendHorizonal, X, ArrowLeft } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";
import { normalizeSenderId } from "../../lib/utils";

import MessageBubble from "./MessageBubble";
import UserListItem from "./UserListItem";

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

    useEffect(() => { fetchUsers(); }, []);

    const { authUser } = useAuthStore();
    useEffect(() => {
        if (authUser?._id) {
            const cleanup = initializeSocket(authUser._id);
            return cleanup;
        }
    }, [authUser]);

    const { setAuthUser } = useMessageStore();
    useEffect(() => {
        if (authUser?._id) setAuthUser(authUser);
    }, [authUser]);

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const [message, setMessage] = useState("");
    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser) return;
        sendMessage({
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: message,
        });
        setMessage("");
    };

    const inputRef = useRef(null);

    useEffect(() => {
        if (selectedUser) {
            inputRef.current?.focus();
        }
    }, [selectedUser]);

    return (

        <Card border="light" className="position-fixed d-flex flex-column shadow" style={{ bottom: "20px", right: "20px", width: "320px", height: "450px", zIndex: 1000 }}>

            <Card.Header className="position-relative d-flex align-items-center fw-bold">

                {selectedUser && (
                    <ArrowLeft role="button" size={20} color="#04263D" onClick={() => handleCloseConversation()} />
                )}

                <span className="position-absolute start-50 translate-middle-x" style={{ pointerEvents: "none" }} >
                    {selectedUser ? selectedUser.fullName : "AroundYou"}
                </span>

                <X role="button" className="ms-auto" onClick={() => { handleCloseConversation(); onClose?.(); }} />

            </Card.Header>

            {!selectedUser ? (

                <ListGroup variant="flush" className="overflow-auto flex-grow-1">

                    {users.map((user) => (
                        <UserListItem key={user._id} user={user} onSelect={selectUser} />
                    ))}

                </ListGroup>

            ) : (

                <>

                    <Card.Body className="d-flex flex-column p-2 overflow-auto gap-2">

                        {messages.map((msg, index) => (

                            <MessageBubble
                                key={`${msg._id}-${index}`}
                                msg={msg}
                                isSender={normalizeSenderId(msg.senderId) === authUser._id?.toString()}
                            />

                        ))}

                        <div ref={messagesEndRef} />
                        
                    </Card.Body>

                    <Card.Footer>

                        <Form onSubmit={handleSend} className="d-flex gap-2">

                            <Form.Control ref={inputRef} type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />

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