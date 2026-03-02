import { useEffect, useState, useRef } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";

const MessengerPopup = ({ onClose }) => {
  const { authUser } = useAuthStore();

  const {
    users,
    messages,
    selectedUser,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
  } = useMessageStore();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Load users when popup opens
  useEffect(() => {
    getUsers();
  }, []);

  // Load messages when user selected
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    await sendMessage(message);
    setMessage("");
  };

  return (
    <Card style={styles.chatContainer}>
      {/* Header */}
      <Card.Header style={styles.header}>
        <span>
          {selectedUser ? selectedUser.fullName : "Select a user"}
        </span>
        <X role="button" onClick={onClose} />
      </Card.Header>

      {/* Body */}
      {!selectedUser ? (
        // Sidebar user list
        <ListGroup variant="flush" style={{ overflowY: "auto" }}>
          {users.map((user) => (
            <ListGroup.Item
              key={user._id}
              action
              onClick={() => setSelectedUser(user)}
            >
              {user.fullName}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <>
          {/* Messages */}
          <Card.Body style={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  ...styles.message,
                  alignSelf:
                    msg.senderId === authUser._id
                      ? "flex-end"
                      : "flex-start",
                  backgroundColor:
                    msg.senderId === authUser._id
                      ? "#0d6efd"
                      : "#e9ecef",
                  color:
                    msg.senderId === authUser._id
                      ? "white"
                      : "black",
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </Card.Body>

          {/* Input */}
          <Card.Footer>
            <Form onSubmit={handleSend} className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
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
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "15px",
    maxWidth: "75%",
    fontSize: "0.9rem",
  },
};

export default MessengerPopup;