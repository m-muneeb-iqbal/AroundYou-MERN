import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Row, Col, Dropdown } from "react-bootstrap";
import { Users, BriefcaseBusiness, MessageCircleMore, UserRound, LogOut, Search, X } from "lucide-react";

import SearchDropdown from "../search/SearchDropdown";
import MessagesPopup from "../messages/MessagesPopup";
import NotificationBell from "../common/NotificationBell";

import { useAuthStore } from "../../store/useAuthStore";
import styles from "../../styles/UI/DropDownItems.module.css";

const Header = ({ showMessages = false, showSearch = false }) => {

    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const [showMessagesPopup, setShowMessagesPopup] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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

                        <Users color="#04263D" size={24} role="button" />
                        <BriefcaseBusiness color="#04263D" size={24} role="button" />
                        <NotificationBell />

                        {showMessages && (

                            <>
                                <MessageCircleMore color="#04263D" size={24} role="button" onClick={() => setShowMessagesPopup((prev) => !prev)} />

                                {showMessagesPopup && (
                                    <MessagesPopup onClose={() => setShowMessagesPopup(false)} />
                                )}

                            </>
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