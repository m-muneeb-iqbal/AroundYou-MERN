import { useNavigate, Navigate } from "react-router-dom";

import { Row, Col, Dropdown } from "react-bootstrap";
import { Users, BriefcaseBusiness, Bell, MessageCircleMore, UserRound, LogOut } from "lucide-react";

import { useAuthStore } from "../../../store/useAuthStore";

import styles from "../../../styles/UI/DropDownItems.module.css";

const Header = () => {

    const { authUser, logout } = useAuthStore ();
    const navigate = useNavigate();
    
    if (!authUser) return <Navigate to="/" />;

    return (
            <Row className="pt-5 align-items-center">

                <Col xs={3}>

                    <div className="d-flex justify-content-center">

                        <img src="/Images/aroundyou.png" className="img-fluid" onClick={() => navigate("/home")} style={{ cursor: "pointer", height: "40px" }} alt="aroundyou" />

                    </div>

                </Col>

                <Col xs={9} className="d-flex justify-content-around">

                    <Users color="#04263D" size={30} role="button" />
                    <BriefcaseBusiness color="#04263D" size={30} role="button" />
                    <Bell color="#04263D" size={30} role="button" />

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