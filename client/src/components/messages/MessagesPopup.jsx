import { useState, useRef, useEffect } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { SendHorizonal, X, ArrowLeft, Phone, MessageSquareDashed } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";
import { useCallStore } from "../../store/useCallStore";

import MessageBubble from "./MessageBubble";
import UserListItem from "./UserListItem";
import PlaceholderAvatar from "../common/PlaceholderAvatar";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MessagesPopup = ({ onClose }) => {

    const { startCall } = useCallStore();

    const {
        users,
        selectedUser,
        messages,
        fetchUsers,
        selectUser,
        sendMessage,
        handleCloseConversation,
        isLoadingUsers,
        isLoadingMessages,
    } = useMessageStore();

    useEffect(() => { fetchUsers(); }, []);

    const { authUser } = useAuthStore();

    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (!isLoadingMessages) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoadingMessages]);

    const [message, setMessage] = useState("");
    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser) return;
        sendMessage({
            conversationId: selectedUser.conversationId,
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

        <Card border="light" className="position-fixed d-flex flex-column shadow" style={{ bottom: "20px", right: "20px", width: "min(410px, calc(100vw - 1.5rem))", height: "min(460px, calc(100vh - 6rem))", zIndex: "var(--z-popup, 1100)" }}>

            <Card.Header className="position-relative d-flex align-items-center fw-bold gap-3">

                {selectedUser ? (

                    <>
                        {/* Back button + Avatar + Name (left) */}
                        <div className="d-flex align-items-center gap-2">
                            <ArrowLeft role="button" size={22} color="#04263D" onClick={() => handleCloseConversation()} style={{ cursor: "pointer", flexShrink: 0 }} />
                            <PlaceholderAvatar name={selectedUser.fullName} profilePic={selectedUser.profilePic} size={40} />
                            <span style={{ fontSize: "0.95rem" }}>{selectedUser.fullName}</span>
                        </div>

                        {/* Phone (right) */}
                        <Phone role="button" size={22} color="#04263D" title="Audio call" onClick={() => startCall(selectedUser, authUser)} className="ms-auto" style={{ cursor: "pointer" }} />

                    </>

                ) : (

                    <>
                        {/* Title (centered) */}
                        <span className="position-absolute start-50 translate-middle-x" style={{ fontSize: "1rem", pointerEvents: "none" }}>AroundYou</span>

                        {/* Close button (right) */}
                        <X role="button" className="ms-auto" onClick={() => { handleCloseConversation(); onClose?.(); }} style={{ cursor: "pointer" }} />

                    </>

                )}

            </Card.Header>

            {!selectedUser ? (

                <ListGroup variant="flush" className="overflow-auto flex-grow-1 px-2">

                    {isLoadingUsers ? (

                        Array.from({ length: 4 }).map((_, i) => (

                            <ListGroup.Item key={i} className="d-flex align-items-center px-3 py-2 gap-3">

                                {/* Avatar skeleton */}
                                <Skeleton circle width={45} height={45} />

                                {/* User info skeleton */}
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <Skeleton width={120} height={14} />
                                        <Skeleton width={40} height={12} />
                                    </div>
                                    <Skeleton width={180} height={12} />
                                </div>

                            </ListGroup.Item>
                        ))

                    ) : users.length === 0 ? (

                        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted py-5">
                            <MessageSquareDashed size={36} color="#C0C0C0" className="mb-2" />
                            <span style={{ fontSize: "0.82rem" }}>No conversations yet</span>
                        </div>

                    ) : (

                        users.map((user) => (
                            <UserListItem key={user.username} user={user} onSelect={selectUser} />
                        ))

                    )}

                </ListGroup>

            ) : (

                <>
                    <Card.Body className="d-flex flex-column p-2 overflow-auto gap-2">

                        {isLoadingMessages ? (

                            Array.from({ length: 6 }).map((_, i) => {

                                // Alternate sender/receiver for natural look
                                const isSender = i % 2 === 0;
                                return (

                                    <div key={i} className={`d-flex flex-column ${isSender ? "align-items-end" : "align-items-start"}`} >
                                        <Skeleton width={`${Math.floor(Math.random() * 30) + 30}%`} height={36} borderRadius={15} />
                                        <Skeleton width={60} height={10} className="mt-1" />
                                    </div>

                                );
                                
                            })

                        ) : (

                            messages.map((msg, index) => (

                                <MessageBubble
                                    key={`${msg._id}-${index}`}
                                    msg={msg}
                                    isSender={msg.isMine}
                                />
                                
                            ))

                        )}

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