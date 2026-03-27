import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { ArrowLeftCircle} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

import { useAuthStore } from "../../../store/useAuthStore";

import { useState, useEffect } from "react";
import { useScrollToSectionCover } from "../../../hooks/useScrollToSectionCover";
import { useToast } from "../../../context/ToastContext";

import styles from "../../../styles/LandingPage/Main/Section1.module.css";

function VerticallyCenteredModal({
    show, onHide, formData, handleChange, handleSignup, isSigningUp, signupDone
}) {

    return (

        <Modal show={show} onHide={onHide} keyboard={false} backdrop="static" size="md" aria-labelledby="contained-modal-title-vcenter" className="fade" centered >

            <Modal.Title id="contained-modal-title-vcenter" className="p-2">

                <ArrowLeftCircle role="button" onClick={onHide}  aria-label="Close" className="border-0" color="#000000"  title="Close Button" size={35}/>

            </Modal.Title>


            <Modal.Body className="p-5">

                {signupDone ? (

                    <div className="text-center">

                        <div style={{ fontSize: "3rem" }}>📧</div>
                        <h5 className="fw-bold mt-3" style={{ color: "#04263D" }}>
                            Check your email
                        </h5>

                        <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
                            We sent a verification link to your email address.
                            Click the link to activate your account.
                        </p>

                        <p className="text-muted" style={{ fontSize: "0.78rem" }}>
                            The link expires in <strong>15 minutes</strong>.
                            Check your spam folder if you don't see it.
                        </p>

                    </div>

                ) : (
                    <>
                        <p className={`fw-bolder text-start ${styles.waitingList}`}> Join the Waiting List and Secure Your Spot!</p>
                        <p className="text-start"> Exciting things are coming, and you don't want to miss out!</p>

                        <Form onSubmit={handleSignup} className="needs-validation" noValidate>

                            <Form.Group as={Col} xs={12} controlId="formGridFullName">

                                <Form.Control value={formData.fullName}  onChange={ handleChange } className="mb-3" name="fullName" type="text" placeholder="Enter your full name" required/>

                            </Form.Group>

                            <Form.Group as={Col} xs={12} controlId="formGridEmail">

                                <Form.Control value={formData.email}  onChange={ handleChange } className="mb-3" name="email" type="email" placeholder="Enter your email" required/>

                            </Form.Group>

                            <Form.Group as={Col} xs={12} controlId="formGridUsername">

                                <Form.Control value={formData.username}  onChange={ handleChange } className="mb-3" name="username" type="text" placeholder="Enter your username" required/>

                            </Form.Group>

                            <Form.Group as={Col} xs={12} controlId="formGridPassword">

                                <Form.Control value={formData.password}  onChange={ handleChange } className="mb-3" name="password" type="password" placeholder="Enter password" required minLength={8} />

                            </Form.Group>

                            <Form.Group as={Col} xs={12} controlId="formGridConfirmPassword">

                                <Form.Control value={formData.confirmPassword}  onChange={ handleChange } className="mb-3" name="confirmPassword" type="password" placeholder="Confirm password" required minLength={8}/>

                            </Form.Group>

                            <Button variant="success" className="w-100 main-submit" type="submit" disabled={isSigningUp}>
                                {isSigningUp ? "Joining..." : "Join"}
                            </Button>

                            <div className="mt-2 mb-1 d-flex align-items-center">
                                <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }}></div>
                                <span style={{ margin: "0 10px", color: "#999", fontSize: "0.85rem", fontWeight: "500" }}>OR</span>
                                <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }}></div>
                            </div>

                            <Button 
                                variant="outline-secondary" 
                                className="w-100" 
                                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ height: "20px", marginRight: "8px" }} />
                                Sign Up with Google
                            </Button>

                        </Form>
                    </>
                )}

            </Modal.Body>

        </Modal>
    );
}

const Section1 = () => {

    const scrollToSectionCover = useScrollToSectionCover();
    
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    
    const location = useLocation();
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
    
        if (location.pathname === "/signup"){
            setModalShow(true);
        }
    
    },[location]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const { signup, isSigningUp } = useAuthStore();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [signupDone, setSignupDone] = useState(false);
    
    const handleSignup = async (e) => {

        e.preventDefault();
        const form = e.target;

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add("was-validated");
            return;
        }

        try {

            await signup(formData);
            console.log("Signup successful");

            // Reset form
            setFormData({
                fullName: "",
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
            });

            form.classList.remove("was-validated");
            setSignupDone(true);

        } catch (err) {
            console.error("Signup failed", err);
            const message = err.response?.data?.message;
            const isUnverified = err.response?.data?.unverified;

            if (isUnverified) {
                setSignupDone(true); // ✅ treat as success, new email was sent
            } else if (message?.includes("Email already exists")) {
                showToast("An account with this email already exists.", "danger");
            } else if (message?.includes("Username already taken")) {
                showToast("This username is already taken.", "danger");
            } else {
                showToast(message || "Registration failed. Please try again.", "danger");
            }
        }

    };

    return (

        <>
        
            <Container fluid="xs" className={`mt-0 ${styles.section1}`}>

                <Row>

                    <Col xs={12} lg={7} className="d-flex flex-column align-items-center text-center mt-3 pt-3">

                        <p className={`text-white fw-bold ${styles.privateSocialText} mt-5 pt-5`}>

                            The private social app made for{" "}
                            <span className={`d-inline-block ${styles.collegeLifeText}`}>
                                college life
                            </span>
                            .
                        </p>

                        <img src="/Images/notIcons/line_home.png" alt="main heading underline" className={`img-fluid ${styles.line}`} />

                        <div className="mt-5 pt-5 pb-1 mt-md-3 pt-md-3 pb-md-0 ">

                            <Button 
                                variant="success" 
                                className={styles.joinBtn} 
                                onClick={() => {
                                    setModalShow(true);
                                    navigate("/signup");
                                }} 
                            >

                                Sign up Now
                                <img src="/Images/icons/arrow-icon.png" className="img-fluid" />

                            </Button>

                            <VerticallyCenteredModal 
                                show={modalShow} 
                                onHide={() => {
                                    setModalShow(false);
                                    setSignupDone(false);
                                    if (location.pathname === "/signup") 
                                        navigate("/");  
                                }} 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSignup={handleSignup} 
                                isSigningUp={isSigningUp} 
                                signupDone={signupDone}
                            />

                        </div>

                        <img src="/Images/icons/Mouse.png" alt="scroll mouse" className={`img-fluid ${styles.mouseIcon}`} onClick={() => scrollToSectionCover(".cover-section")} />

                    </Col>

                    <Col xs={12} lg={5} className="flex-column d-flex align-items-center justify-content-center">

                        <div className="d-lg-block d-none px-5">

                            <div className={`d-flex justify-content-center align-items-center rounded-circle ${styles.outer1}`}>

                                <div className={`${styles.mainImage} position-absolute`}>

                                    <img src="/Images/notIcons/Mobile logo Style.png" alt="aroundyou logo" className="img-fluid" />

                                </div>

                                <div className={`${styles.image1} position-absolute`}>

                                    <img src="/Images/notIcons/image 22.png" alt="icon 1" className="img-fluid" />

                                </div>

                                <div className={`${styles.checkImage1} position-absolute`}>

                                    <img src="/Images/notIcons/check-image-1.png" alt="check icon 1" className="img-fluid" />

                                </div>

                                <div className={`${styles.image2} position-absolute`}>

                                    <img src="/Images/notIcons/Group 494.png" alt="icon 2" className="img-fluid" />

                                </div>

                                <div className={`${styles.image3} position-absolute`}>

                                    <img src="/Images/notIcons/image 23.png" alt="icon 3" className="img-fluid" />

                                </div>

                                <div className={`${styles.checkImage3} position-absolute`}>

                                    <img src="/Images/notIcons/check-image-3.png" alt="check icon 3" className="img-fluid" />

                                </div>

                                <div className={`${styles.image4} position-absolute`}>

                                    <img src="/Images/notIcons/Rectangle 163.png" alt="icon 4" className="img-fluid" />

                                </div>

                                <div className={`${styles.checkImage4} position-absolute`}>

                                    <img src="/Images/notIcons/check-image-4.png" alt="check icon 4" className="img-fluid" />
                                    
                                </div>

                                <div className={`${styles.image5} position-absolute`}>

                                    <img src="/Images/notIcons/Group 497.png" alt="icon 5" className="img-fluid" />

                                </div>

                                <div className={`${styles.image6} position-absolute`}>

                                    <img src="/Images/notIcons/Rectangle 168.png" alt="icon 6" className="img-fluid" />

                                </div>

                                <div className={`${styles.checkImage6} position-absolute`}>

                                    <img src="/Images/notIcons/check-image-6.png" alt="check icon 6" className="img-fluid" />

                                </div>

                                <div className={`${styles.image7} position-absolute`}>

                                    <img src="/Images/notIcons/image 21.png"  alt="icon 7" className="img-fluid" />

                                </div>

                                <div className={`${styles.checkImage7} position-absolute`}>

                                    <img src="/Images/notIcons/check-image-7.png" alt="check icon 7" className="img-fluid" />

                                </div>

                                <div className={`${styles.image8} position-absolute`}>

                                    <img src="/Images/notIcons/Group 493.png" alt="icon 8" className="img-fluid" />

                                </div>

                                <div className={`${styles.image9} position-absolute`}>

                                    <img src="/Images/notIcons/Avatar 16 1.png" alt="icon 9" className="img-fluid" />

                                </div>

                                <div className={`${styles.checkImage9} position-absolute`}>

                                    <img src="/Images/notIcons/check-image-9.png" alt="check icon 9" className="img-fluid" />

                                </div>

                                <div className={`${styles.image10} position-absolute`}>

                                    <img src="/Images/notIcons/Rectangle 169.png" alt="icon 10" className="img-fluid" />

                                </div>

                                <div className={`${styles.checkImage10} position-absolute`}>

                                    <img src="/Images/notIcons/check-image-10.png" alt="check icon 10" className="img-fluid" />

                                </div>

                                <div className={`${styles.image11} position-absolute`}>

                                    <img src="/Images/notIcons/Group 495.png" alt="icon 11" className="img-fluid" />

                                </div>

                                <div className={`${styles.image12} position-absolute`}>

                                    <img src="/Images/notIcons/Rectangle 167.png" alt="icon 12" className="img-fluid" />

                                </div>

                                <div className={`${styles.checkImage12} position-absolute`}>

                                    <img src="/Images/notIcons/check-image-12.png" alt="check icon 12" className="img-fluid" />

                                </div>

                                <div className={`${styles.image13} position-absolute`}>

                                    <img src="/Images/notIcons/Rectangle 165.png" alt="icon 13" className="img-fluid" />

                                </div>

                                <div className={`${styles.checkImage13} position-absolute`}>

                                    <img src="/Images/notIcons/check-image-13.png" alt="check icon 13" className="img-fluid" />

                                </div>

                                <div className={`${styles.line1} position-absolute`}></div>
                                <div className={`${styles.line2} position-absolute`}></div>
                                <div className={`${styles.line3} position-absolute`}></div>
                                <div className={`${styles.line4} position-absolute`}></div>
                                <div className={`${styles.line5} position-absolute`}></div>
                                <div className={`${styles.line6} position-absolute`}></div>
                                <div className={`${styles.line7} position-absolute`}></div>
                                <div className={`${styles.line8} position-absolute`}></div>
                                <div className={`${styles.line9} position-absolute`}></div>
                                <div className={`${styles.line10} position-absolute`}></div>
                                <div className={`${styles.line11} position-absolute`}></div>
                                <div className={`${styles.line12} position-absolute`}></div>
                                <div className={`${styles.line13} position-absolute`}></div>

                                <div className={`${styles.outer2} d-flex justify-content-center align-items-center rounded-circle`}>

                                    <div className={`${styles.outer3} d-flex justify-content-center align-items-center rounded-circle`}>

                                        <div className={`${styles.outer4} d-flex justify-content-center align-items-center rounded-circle`}></div>

                                    </div>

                                </div>

                            </div>

                        </div>
                        
                    </Col>

                </Row>

            </Container>
        
        </>    

    );
  
};

export default Section1;