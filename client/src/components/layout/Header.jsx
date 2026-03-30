import { useState, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Row, Col, Dropdown } from "react-bootstrap";
import { Users, BriefcaseBusiness, MessageCircleMore, UserRound, LogOut, Search, X } from "lucide-react";

import SearchDropdown from "../search/SearchDropdown";
import MessagesPopup from "../messages/MessagesPopup";
import FriendListPopup from "../friends/FriendListPopup";
import NotificationBell from "../common/NotificationBell";

import { useAuthStore } from "../../store/useAuthStore";
import { useMessageStore } from "../../store/useMessageStore";
import styles from "../../styles/UI/DropDownItems.module.css";

const Header = ({ showMessages = false, showSearch = false }) => {

    const { authUser, logout } = useAuthStore();
    const { initializeSocket, fetchUsers, users } = useMessageStore();
    const unreadConversations = users.filter((u) => (u.unreadCount || 0) > 0).length;
    const navigate = useNavigate();
    const [showMessagesPopup, setShowMessagesPopup] = useState(false);
    const [showFriendListPopup, setShowFriendListPopup] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    useEffect(() => {
        if (!authUser) return;
        const cleanup = initializeSocket();
        fetchUsers();
        return cleanup;
    }, [authUser]);

    if (!authUser) return <Navigate to="/" />;

    return (
        
        <>
            <Row className="py-3 align-items-center border-bottom">

                {/* ── Left: Logo + Search ── */}
                <Col xs={mobileSearchOpen ? 12 : 5} sm={5} md={4} lg={3} className="d-flex align-items-center gap-2" >

                    {/* Search open on mobile — show input + close */}
                    {mobileSearchOpen ? (

                        <div className="d-flex align-items-center gap-2 w-100 d-lg-none">

                            <SearchDropdown fullWidth />
                            <X size={20} color="#04263D" role="button" onClick={() => setMobileSearchOpen(false)} />

                        </div>

                    ) : (

                        <>
                            
                            <Link to="/home">

                                <img src="/Images/aroundyou.png" style={{ height: "34px", flexShrink: 0 }} alt="aroundyou" />

                            </Link>

                            {/* Search bar — desktop (lg+) only, inline next to logo */}
                            {showSearch && (

                                <div className="d-none d-lg-block">
                                    <SearchDropdown />
                                </div>

                            )}

                            {/* Search icon — below lg, next to logo */}
                            {showSearch && (

                                <Search className="d-lg-none" size={22} color="#04263D" role="button" onClick={() => setMobileSearchOpen(true)} />

                            )}

                        </>

                    )}

                </Col>

                {/* ── Right: Nav Icons — hidden when mobile search is open ── */}
                {!mobileSearchOpen && (

                    <Col xs={7} sm={7} md={8} lg={9} className="d-flex justify-content-end align-items-center gap-3 gap-md-4 pe-3" >

                        <Users color="#04263D" size={24} role="button" aria-label="Friends" title="Friends" onClick={() => { setShowFriendListPopup((prev) => !prev); setShowMessagesPopup(false); }} />
                        <BriefcaseBusiness color="#04263D" size={24} role="button" aria-label="Jobs" title="Jobs" />
                        <NotificationBell />

                        {showMessages && (
                            <div className="position-relative d-inline-flex" style={{ cursor: "pointer" }} onClick={() => { setShowMessagesPopup((prev) => !prev); setShowFriendListPopup(false); }}>
                                <MessageCircleMore color="#04263D" size={24} role="button" aria-label="Messages" title="Messages" />
                                {unreadConversations > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                        style={{ fontSize: "0.6rem", minWidth: "16px", height: "16px", lineHeight: "16px", padding: "0 4px", backgroundColor: "#ef4444", color: "#fff", pointerEvents: "none" }}
                                    >
                                        {unreadConversations > 99 ? "99+" : unreadConversations}
                                    </span>
                                )}
                            </div>
                        )}

                        {showMessagesPopup && (
                            <MessagesPopup onClose={() => setShowMessagesPopup(false)} />
                        )}

                        {showFriendListPopup && (
                            <FriendListPopup
                                onClose={() => setShowFriendListPopup(false)}
                                onOpenMessages={() => setShowMessagesPopup(true)}
                            />
                        )}

                        <Dropdown align="end">

                            <Dropdown.Toggle as="span" style={{ cursor: "pointer" }}>
                                <UserRound color="#04263D" size={24} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>

                                <Dropdown.Item className={styles.dropDownItem} onClick={() => navigate("/profile")}>
                                    Profile
                                </Dropdown.Item>

                                <Dropdown.Item className={styles.dropDownItem} onClick={() => navigate("/settings")}>
                                    Settings
                                </Dropdown.Item>

                                {authUser?.isAdmin && (
                                    <Dropdown.Item className={styles.dropDownItem} onClick={() => navigate("/admin")}>
                                        Dashboard
                                    </Dropdown.Item>
                                )}

                                <Dropdown.Divider />

                                <Dropdown.Item className={styles.dropDownItem} onClick={async () => { await logout(); navigate("/"); }} >
                                    Logout <LogOut color="#FF0000" size={18} className="mx-2" />
                                </Dropdown.Item>

                            </Dropdown.Menu>

                        </Dropdown>

                    </Col>
                )}

            </Row>

        </>

    );
    
};

export default Header;