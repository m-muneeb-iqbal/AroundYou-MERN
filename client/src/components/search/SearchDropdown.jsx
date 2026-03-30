import { useState, useEffect, useRef } from "react";
import { Form, InputGroup, ListGroup, Spinner } from "react-bootstrap";
import { Search } from "lucide-react";

import { axiosInstance } from "../../lib/axios";

import PlaceholderAvatar from "../common/PlaceholderAvatar";
import UserProfileModal from "./UserProfileModal";

const relationshipLabel = {
    none: { text: "Add Friend", color: "#04263D" },
    pending_sent: { text: "Pending", color: "#898C8F" },
    pending_received: { text: "Respond", color: "#198754" },
    friends: { text: "Friends ✓", color: "#198754" }
};

const SearchDropdown = ({ fullWidth = false }) => {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const debounceRef = useRef(null);
    const containerRef = useRef(null);

    // Debounce search — wait 300ms after user stops typing
    useEffect(() => {

        if (!query.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {

            try {

                setLoading(true);
                const res = await axiosInstance.get(
                    `/user/search?q=${encodeURIComponent(query)}`,
                    { withCredentials: true }
                );

                setResults(res.data);
                setShowDropdown(true);

            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    const handleSelect = (user) => {
        setSelectedUser(user);
        setShowDropdown(false);
        setQuery("");
    };

    // Update result in dropdown after action taken in modal
    const handleActionDone = (updatedUser) => {

        setResults((prev) =>
            prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
        );
        setSelectedUser(null);

    };

    return (

        <>

            <div ref={containerRef} className="position-relative" style={{ width: fullWidth ? "100%" : "200px" }}>

                <InputGroup size="sm">

                    <InputGroup.Text style={{ backgroundColor: "#f5f5f5", border: "1px solid #E0E0E0", borderRight: "none", }} >

                        {loading
                            ? <Spinner animation="border" size="sm" style={{ width: 12, height: 12 }} />
                            : <Search size={14} color="#898C8F" />
                        }

                    </InputGroup.Text>

                    <Form.Control
                        type="text"
                        placeholder="Search people..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => results.length > 0 && setShowDropdown(true)}
                        style={{
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #e0e0e0",
                            borderLeft: "none",
                            fontSize: "0.82rem",
                            boxShadow: "none",
                        }}
                    />
                </InputGroup>

                {/* Dropdown results */}
                {showDropdown && (

                    <div
                        className="position-absolute bg-white shadow-sm rounded"
                        style={{
                            top: "calc(100% + 4px)",
                            left: 0,
                            width: "260px",
                            zIndex: 1050,
                            border: "1px solid #e0e0e0",
                            maxHeight: "320px",
                            overflowY: "auto",
                        }}
                    >
                        {results.length === 0 ? (

                            <div className="text-muted text-center py-3" style={{ fontSize: "0.82rem" }} >
                                No users found
                            </div>

                        ) : (

                            <ListGroup variant="flush">

                                {results.map((user) => (

                                    <ListGroup.Item key={user._id} action className="d-flex align-items-center gap-2 py-2 px-3" style={{ cursor: "pointer", borderColor: "#F5F5F5" }} onClick={() => handleSelect(user)} >

                                        <PlaceholderAvatar name={user.fullName} profilePic={user.profilePic} size={32} />

                                        <div className="flex-grow-1 overflow-hidden">

                                            <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", color: "#04263D" }}>
                                                {user.fullName}
                                            </div>

                                            {user.jobTitle && (

                                                <div className="text-truncate text-muted" style={{ fontSize: "0.72rem" }} >
                                                    {user.jobTitle}
                                                </div>
                                            )}

                                        </div>

                                        {/* Relationship hint */}
                                        <span style={{ fontSize: "0.65rem", color: relationshipLabel[user.relationshipStatus]?.color, whiteSpace: "nowrap", }} >
                                            {relationshipLabel[user.relationshipStatus]?.text}
                                        </span>

                                    </ListGroup.Item>
                                ))}

                            </ListGroup>
                        )}

                    </div>
                )}

            </div>

            {/* Profile modal */}
            {selectedUser && (

                <UserProfileModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onActionDone={handleActionDone}
                />

            )}

        </>

    );
    
};

export default SearchDropdown;