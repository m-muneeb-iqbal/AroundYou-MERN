import { Users, BriefcaseBusiness, Bell, MessageCircleMore, UserRound, Search, LogOut } from "lucide-react";
import { Col, Form, Row, Image, Button, Dropdown, Card } from 'react-bootstrap';

import { useNavigate } from "react-router-dom";
import { useAuthStore} from "../../store/useAuthStore";

import { useEffect, useState } from "react";
import axios from "axios";
    
const Reusable = () => {

    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    
    if(!authUser) return <navigate to = "/" />;   

    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        role: "",
        jobTitle: "",
        company: "",
        location: "",
        website: "",
    });

    // Redirect + prefill form
    useEffect(() => {
        if (!authUser) {
        navigate("/");
        return;
        }

        setFormData({
            email: authUser.email || "",
            fullName: authUser.fullName || "",
            role: authUser.role || "",
            jobTitle: authUser.jobTitle || "",
            company: authUser.company || "",
            location: authUser.location || "",
            website: authUser.website || "",
        });
    }, [authUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(
                "http://localhost:5000/api/auth/update-profile",
                formData,
                { withCredentials: true }
            );

            console.log("Profile updated:", res.data);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            alert("Failed to update profile.");
        }
    };

    return (

        <div className="container-fluid">
            
            <div className="row pt-5 align-items-center">

                <div className="col-3">

                    <div className="d-flex justify-content-center">
                        <img as="button" src="/Images/aroundyou.png" style={{ cursor: "pointer", height: "40px", width: "auto" }} className="img-fluid" alt="aroundyou" onClick={async () => { navigate("/home"); }} />
                    </div>

                </div>

                <div className="col-9 d-flex justify-content-around">
                    <Users color = "#04263D" role="button" title="Users" size={32}/>
                    <BriefcaseBusiness color = "#04263D" role="button" title="Jobs" size={32}/>
                    <Bell color = "#04263D" role="button" title="Notifications" size={32}/>
                    <MessageCircleMore color = "#04263D" role="button" title="Messages" size={32}/>
                    <Dropdown align="end">
                        <Dropdown.Toggle as="span" id="profile-dropdown" style={{ cursor: "pointer" }} >
                            <UserRound color="#04263D" size={32} role="button" title="Profile" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item  as="button" onClick={async () => { navigate("/profile"); }} >Profile</Dropdown.Item>
                            <Dropdown.Item  href="#/settings">Settings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item  as="button" onClick={async () => { await logout(); navigate("/"); }} >
                                <span>Logout</span>
                                <LogOut color="#FF0000" size={18} title="LogOut" className="mx-2" />
                            </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>

                </div>

            </div>

            <div className="row pt-5">
                
                <div className="col-12 d-flex">
                    <Card border="light">
                        <Card.Body className="d-flex align-items-center">
                            <Col xs={6} md={4}>
                                <Image src="/Images/aroundyou.png" style={{ width: 'auto', objectFit: "cover"}} roundedCircle alt="profile" />
                            </Col>
                            <div className="ms-3">
                                <Card.Title className="mb-0">{authUser.fullName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {authUser ? authUser.email : "Email not found"}
                                </Card.Subtitle>
                            </div>
                        </Card.Body>
                    </Card>

                </div>

            </div>

            <div className="row pt-5">

                <div className="col-12">

                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridFullName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control value={formData.fullName} onChange={handleChange} name="fullName" type="text" placeholder="Your Full Name" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control value={formData.email} onChange={handleChange} name="email" type="email" placeholder="Your Email Address" />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridDesignation">
                                <Form.Label>Designation</Form.Label>
                                <Form.Control value={formData.jobTitle} onChange={handleChange} name="jobTitle" type="text" placeholder="Your Designation" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridRole">
                                <Form.Label>Role</Form.Label>
                                <Form.Select value={formData.role} name="role" onChange={handleChange}>
                                    <option disabled >-- Select your role --</option>
                                    <option>Alumni</option>
                                    <option>Student</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCompany">
                                <Form.Label>Company</Form.Label>
                                <Form.Control value={formData.company} onChange={handleChange} name="company" type="text" placeholder="Your Company Name" />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control value={formData.location} onChange={handleChange} name="location" type="text" placeholder="Your City of Residence" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridWebsite">
                                <Form.Label>Portfolio/Website</Form.Label>
                                <Form.Control value={formData.website} onChange={handleChange} name="website" type="text" placeholder="Your Personal Website or Portfolio" />
                            </Form.Group>
                        </Row>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>

                </div>

            </div>

        </div>
    );

};
export default Reusable;