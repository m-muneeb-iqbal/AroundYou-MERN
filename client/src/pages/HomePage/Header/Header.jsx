import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { House, Users, BriefcaseBusiness, Bell, MessageCircleMore, UserRound, Search, LogOut } from "lucide-react";
import { Row, Col, Dropdown } from 'react-bootstrap';

import { useAuthStore} from "../../../store/useAuthStore";
import MessagesPopup from "../../../components/messages/MessagesPopup";

import styles from "../../../styles/UI/DropDownItems.module.css";


const Header = () => {

    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState(false);

    if(!authUser) return <navigate to = "/" />;

    return (

        <>
        
            <Row className="pt-5 align-items-center">

                <Col xs={3}>

                    <div className="d-flex align-items-center gap-2">

                        <img src="/Images/aroundyou.png" className="img-fluid" onClick={async () => { navigate("/home"); }} style={{ height: "40px", width: "auto", cursor: "pointer" }} alt="aroundyou" />
                        <div className="position-relative flex-grow-1">

                            <input type="text" className="form-control form-control-sm pe-4" placeholder="Search" style={{ height: "40px", lineHeight: "40px", fontSize: "14px" }}/>
                            <Search color="#04263D" size={20} className="position-absolute top-50 end-0 translate-middle-y me-2" />

                        </div>
                        
                    </div>

                </Col>

                <Col xs={9} className="d-flex justify-content-around">

                    <House color = "#04263D" role="button" title="Home" size={30}/>
                    <Users color = "#04263D" role="button" title="Users" size={30}/>
                    <BriefcaseBusiness color = "#04263D" role="button" title="Jobs" size={30}/>
                    <Bell color = "#04263D" role="button" title="Notifications" size={30}/>
                    <MessageCircleMore color="#04263D" size={30} role="button" onClick={() => setShowChat(true)} />

                    <Dropdown align="end">

                        <Dropdown.Toggle as="span" id="profile-dropdown" style={{ cursor: "pointer" }} >
                            <UserRound color="#04263D" size={30} role="button" title="Profile" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>

                            <Dropdown.Item className={styles.dropDownItem} as="a" href="/profile" >Profile</Dropdown.Item>
                            <Dropdown.Item className={styles.dropDownItem} as="a" href="/settings">Settings</Dropdown.Item>
                            <Dropdown.Divider />

                            <Dropdown.Item className={styles.dropDownItem} as="button" onClick={async () => { await logout(); navigate("/"); }} >

                                <span>Logout</span>
                                <LogOut color="#FF0000" size={18} title="LogOut" className="mx-2" />

                            </Dropdown.Item>

                        </Dropdown.Menu>

                    </Dropdown>

                </Col>

            </Row>

            {/* Chat Popup */}
            {showChat && (
                <MessagesPopup onClose={() => setShowChat(false)} />
            )}

        </>       

    );
};

export default Header;