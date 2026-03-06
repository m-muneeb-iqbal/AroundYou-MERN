import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { Row, Col, Dropdown, Form, InputGroup } from "react-bootstrap";
import { Users, BriefcaseBusiness, Bell, MessageCircleMore, UserRound, LogOut, Search } from "lucide-react";

import MessagesPopup from "../messages/MessagesPopup";

import { useAuthStore } from "../../store/useAuthStore";

import styles from "../../styles/UI/DropDownItems.module.css";

const Header = ({ showMessages = false, showSearch = false, onSearch }) => {

    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const [showMessagesPopup, setShowMessagesPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        onSearch?.(e.target.value);
    };

    if (!authUser) return <Navigate to="/" />;

    return (

        <Row className="pt-5 align-items-center">

            <Col xs={2}>

                <div className="d-flex justify-content-center">

                    <img
                        src="/Images/aroundyou.png"
                        className="img-fluid"
                        onClick={() => navigate("/home")}
                        style={{ cursor: "pointer", height: "40px" }}
                        alt="aroundyou"
                    />

                    {showSearch && (
                        <InputGroup size="sm" style={{ width: "180px" }}>
                            <InputGroup.Text
                                style={{
                                    backgroundColor: "#f5f5f5",
                                    border: "1px solid #e0e0e0",
                                    borderRight: "none",
                                }}
                            >
                                <Search size={14} color="#898C8F" />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={{
                                    backgroundColor: "#f5f5f5",
                                    border: "1px solid #e0e0e0",
                                    borderLeft: "none",
                                    fontSize: "0.82rem",
                                    boxShadow: "none",
                                }}
                            />
                        </InputGroup>
                    )}

                </div>

            </Col>

            <Col xs={10} className="d-flex justify-content-around align-items-center">

                <Users color="#04263D" size={30} role="button" />
                <BriefcaseBusiness color="#04263D" size={30} role="button" />
                <Bell color="#04263D" size={30} role="button" />

                {/* Only renders on pages that need it */}
                {showMessages && (
                    <>

                        <MessageCircleMore
                            color="#04263D"
                            size={30}
                            role="button"
                            onClick={() => setShowMessagesPopup((prev) => !prev)}
                        />

                        {showMessagesPopup && (
                            <MessagesPopup onClose={() => setShowMessagesPopup(false)} />
                        )}
                    </>

                )}

                <Dropdown align="end">

                    <Dropdown.Toggle as="span" style={{ cursor: "pointer" }}>
                        <UserRound color="#04263D" size={30} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>

                        <Dropdown.Item className={styles.dropDownItem} onClick={() => navigate("/profile")} >
                            Profile
                        </Dropdown.Item>

                        <Dropdown.Item className={styles.dropDownItem} onClick={() => navigate("/settings")} >
                            Settings
                        </Dropdown.Item>

                        <Dropdown.Divider />

                        <Dropdown.Item className={styles.dropDownItem} onClick={async () => { await logout(); navigate("/"); }} >
                                Logout <LogOut color="#FF0000" size={18} className="mx-2" />
                        </Dropdown.Item>

                    </Dropdown.Menu>
                    
                </Dropdown>

            </Col>

        </Row>
    );
};

export default Header;