import { Container, Row, Col, Form, Button, Offcanvas, Modal } from "react-bootstrap";
import { ArrowLeftCircle} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore"

import { useState, useEffect } from "react";
import { useToast } from "../../../context/ToastContext";

import styles from "../../../styles/LandingPage/Header/Header.module.css";

function VerticallyCenteredModal({
    show, onHide, formData, handleChange, handleLogin, isLoggingIn
}) {

    return (

        <Modal show={show} onHide={onHide} keyboard={false} backdrop="static" size="md" aria-labelledby="contained-modal-title-vcenter" className="fade" centered >

            <Modal.Title id="contained-modal-title-vcenter" className="p-2">

                <ArrowLeftCircle role="button" onClick={onHide}  aria-label="Close" className="border-0" color="#000000"  title="Close Button" size={35}/>

            </Modal.Title>


            <Modal.Body className="p-5">

                <p className={`fw-bolder text-start ${styles.signIn}`}> Sign In to Your Account</p>
                <p className="text-start">  Welcome back! Please sign in to continue.</p>

                <Form className="needs-validation" onSubmit={handleLogin} noValidate>

                    <Form.Group as={Col} xs={12} controlId="formGridEmail">

                        <Form.Control value={formData.email} onChange={ handleChange } className="mb-3" name="email" type="email" placeholder="Enter your email" required/>

                    </Form.Group>

                    <Form.Group as={Col} xs={12} controlId="formGridPassword">

                        <Form.Control value={formData.password} onChange={ handleChange } className="mb-3" name="password" type="password" placeholder="Enter your password" required/>
                        
                    </Form.Group>

                    <Button variant="success" className="w-100" type="submit" disabled={isLoggingIn}>
                        {isLoggingIn ? "Signing In..." : "Sign In"}
                    </Button>

                </Form>

            </Modal.Body>

        </Modal>
    );
}

const Header = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    
    const location = useLocation();
    const [modalShow, setModalShow] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {

        if (location.pathname === "/login"){
            setModalShow(true);
        }

    }, [location.pathname]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const { login, isLoggingIn, checkAuth } = useAuthStore();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();
        const form = e.target;

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add("was-validated");
            return;
        }

        try {

            await login (formData);
            console.log("Login successful");

            form.classList.remove("was-validated");

            showToast("Logged in successfully!", "success");

            setTimeout(async () => {
                await checkAuth();
            }, 3000);
            
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            showToast("Login failed", "danger");

        }
    }

    return (

        <>

            <header className={styles.header}>

                <Container fluid="xs">

                    <Row className="pt-5 align-items-center">

                        {/* Left: Menu Button */}
                        <Col xs={4}>
                            <Button onClick={handleShow} className={`${styles.menuBtn} border-0 bg-transparent p-0`}>
                                <img src="/Images/icons/menu-button.png" alt="menu button" className="img-fluid"/>
                            </Button>
                        </Col>

                        {/* Center: Logo */}
                        <Col xs={4} className="text-center">
                            <img src="/Images/notIcons/aroundyou-main-heading.png" alt="Edyou logo" className="img-fluid"/>
                        </Col>

                        {/* Right: Log In Button */}
                        <Col xs={4} className="d-flex justify-content-center">

                            <Button 
                                variant="success" 
                                className={`${styles.signinBtn} btn-sm`} 
                                onClick={() => {
                                    setModalShow(true);
                                    navigate("/login");
                                }} 
                            >
                                Log In
                            </Button>

                        </Col>

                        <VerticallyCenteredModal 

                            show={modalShow} 
                            onHide={() => {
                                setModalShow(false);
                                if (location.pathname === "/login") 
                                    navigate("/");  
                            }} 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleLogin={handleLogin} 
                            isLoggingIn={isLoggingIn} 
                        />

                    </Row>

                </Container>

                {/* --- Offcanvas Sidebar --- */}
                <Offcanvas show={show} onHide={handleClose} backdrop="static" className="bg-light border" style={{ width: "1000px" }}>

                    <Offcanvas.Header>

                        <Offcanvas.Title>

                            <img src="/Images/notIcons/edyou-sidebar.svg" alt="Aroundyou Sidebar Logo" className="img-fluid"/>

                        </Offcanvas.Title>

                        <Button className="border-0 bg-transparent ms-auto" onClick={handleClose} aria-label="Close">

                            <img src="/Images/icons/sidebar-close-button.svg" alt="close" className="img-fluid" />

                        </Button>

                    </Offcanvas.Header>

                    <Offcanvas.Body>

                        {/* Menu Items */}
                        <Col xs={12}>
                            <h4 className="text-black-50">Menu</h4>
                        </Col>

                        {/* Desktop Menu */}
                        <div className="d-lg-flex d-none justify-content-between mt-5" style={{ height: "200px" }}>

                            <Col lg={4} className="d-flex flex-column justify-content-between">
                                <h3 className={`fw-bold ${styles.sidebarMenuItemsColor}`}>Features</h3>
                                <h3 className={`fw-bold ${styles.sidebarMenuItemsColor}`}>About Us</h3>
                                <h3 className={`fw-bold ${styles.sidebarMenuItemsColor}`}>Schools</h3>
                            </Col>

                            <Col lg={8} className="d-flex flex-column justify-content-between">
                                <h3 className={`fw-bold ${styles.sidebarMenuItemsColor}`}>Wishlist</h3>
                                <h3 className={`fw-bold ${styles.sidebarMenuItemsColor}`}>Contact Us</h3>
                                <h3 className={`fw-bold ${styles.sidebarMenuItemsColor}`}>Privacy Policy</h3>

                            </Col>

                        </div>

                        {/* Mobile Menu */}
                        <div className="d-lg-none d-flex flex-column mt-5">

                            {[ "Features", "About Us", "Schools", "Wishlist", "Contact Us", "Privacy Policy",].map((item, idx) => (
                                <h3 key={idx} className={`fw-bold ${styles.sidebarMenuItemsColor}`}>
                                    {item}
                                </h3>
                            ))}
                        </div>

                        {/* Contact Info */}
                        <div className="mt-5">

                            <Row>

                                <Col xs={12} md={6} className="mb-3">
                                    <label className="fw-bold text-black-50">Email</label>
                                    <p className="fw-bold text-black-50">supportme@aroundyou.com</p>
                                </Col>

                                <Col xs={12} md={6} className="mb-3">
                                    <label className="fw-bold text-black-50">Phone</label>
                                    <p className="fw-bold text-black-50">+1 607 254 4636</p>
                                </Col>

                                <Col xs={12} md={6}>
                                    <label className="fw-bold text-black-50">Address</label>
                                    <p className="fw-bold text-black-50"> Ithaca, NY 14850, United States </p>
                                </Col>

                            </Row>

                            <div className="mt-3">
                                <img src="/Images/notIcons/apple-button-sidebar-footer.svg" alt="apple button sidebar"/>
                            </div>

                        </div>

                    </Offcanvas.Body>

                </Offcanvas>

            </header>

        </>

    );
};

export default Header;