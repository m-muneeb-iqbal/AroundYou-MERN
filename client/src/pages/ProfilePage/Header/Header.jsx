import { Row, Col } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { useAuthStore} from "../../../store/useAuthStore"

import {Users, BriefcaseBusiness, Bell, MessageCircleMore, UserRound, LogOut } from "lucide-react";
import { Dropdown } from 'react-bootstrap';;

import styles from "../../../styles/UI/DropDownItems.module.css";

const Header = () => {

    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();

    if(!authUser) return <navigate to = "/" />;

    return (

        <Row className="pt-5 align-items-center">

            <Col xs={3}>

                <div className="d-flex justify-content-center">
                    <img as="button" src="/Images/aroundyou.png" className="img-fluid" onClick={async () => { navigate("/home"); }} style={{ cursor: "pointer", height: "40px", width: "auto" }} alt="aroundyou" />
                </div>

            </Col>

            <Col xs={9} className="d-flex justify-content-around">

                <Users color = "#04263D" role="button" title="Users" size={30}/>
                <BriefcaseBusiness color = "#04263D" role="button" title="Jobs" size={30}/>
                <Bell color = "#04263D" role="button" title="Notifications" size={30}/>
                <MessageCircleMore color = "#04263D" role="button" title="Messages" size={30}/>

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

    );
};

export default Header;