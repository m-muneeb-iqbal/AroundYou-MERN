import { Container, Row, Col } from "react-bootstrap";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../store/useAuthStore"

import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import axios from "axios";

import styles from "../../../styles/LandingPage/Header/Header.module.css";

const Header = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { setAuthUser } = useAuthStore(); // <-- Zustand action to set user
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const modalEl = document.getElementById("signInModal");
        if (!modalEl) return;

        const modalInstance = new bootstrap.Modal(modalEl);

        if (location.pathname === "/login") {
            modalInstance.show();
        }

        const handleHidden = () => {
            document.body.classList.remove("modal-open");
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) backdrop.remove();
            navigate("/");
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, [location, navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {

        e.preventDefault();
        const form = e.target;
        setLoading(true);

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add("was-validated");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                formData,
                {
                    withCredentials: true, // important so JWT cookie gets stored
                }
            );

            // save user in Zustand store
            setAuthUser(res.data.user);

            form.classList.remove("was-validated");

            // close modal
            const modalEl = document.getElementById("signInModal");
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            // navigate to home
            navigate("/home");

        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Login failed");

        } finally {
            setLoading(false);
        }
    }

    return (

        <header className={styles.header}>

            <Container fluid="xs">

                <Row className="pt-5 align-items-center">

                    {/* Left: Menu Button */}
                    <Col xs={4}>
                        <button className={`${styles.menuBtn} border-0 bg-transparent p-0`} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                            <img src="/Images/icons/menu-button.png" alt="menu button" className="img-fluid"/>
                        </button>
                    </Col>

                    {/* Center: Logo */}
                    <Col xs={4} className="text-center">
                        <img src="/Images/notIcons/aroundyou-main-heading.png" alt="Edyou logo" className="img-fluid"/>
                    </Col>

                    {/* Right: Log In Button */}
                    <Col xs={4} className="d-flex justify-content-center">
                        <button type="button" className={`${styles.signinBtn} btn btn-success btn-sm`} onClick={() => navigate("/login")} >
                            Log In
                        </button>
                    </Col>

                </Row>

            </Container>

            {/* --- Offcanvas Sidebar --- */}
            <div className="offcanvas offcanvas-start bg-light border" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" style={{ width: "1000px" }}>

                <div className="offcanvas-header justify-content-between">

                    <button type="button" className="border-0 bg-transparent" data-bs-dismiss="offcanvas" aria-label="Close" >
                        <img src="/Images/icons/sidebar-close-button.svg" alt="close" className="img-fluid"/>
                    </button>

                    <img src="/Images/notIcons/edyou-sidebar.svg" alt="Aroundyou Sidebar Logo" className="img-fluid"/>

                </div>

                <div className="offcanvas-body">

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

                </div>

            </div>

            {/* --- Modal --- */}
            <div className="modal fade" id="signInModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">

                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">

                    <div className="modal-content">

                        <div className="d-flex justify-content-start p-3">

                            <button type="button" className="border-0 bg-transparent" data-bs-dismiss="modal" aria-label="Close">
                                <svg viewBox="0 0 16 16" width="2em" height="2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                                    />
                                </svg>

                            </button>

                        </div>

                        <div className="modal-body p-5">

                            <p className={`fw-bolder text-start ${styles.signIn}`}> Sign In to Your Account</p>
                            <p className="text-start">  Welcome back! Please sign in to continue.</p>

                            <form className="needs-validation" onSubmit={handleLogin}  noValidate>

                                <input type="email" name="email" placeholder="Enter your email" className="form-control mb-3" value={formData.email} onChange={handleChange} required/>
                                <input type="password" name="password" placeholder="Enter your password" className="form-control mb-3" value={formData.password} onChange={handleChange} required/>

                                <button className="btn btn-success w-100" type="submit" disabled={loading}>
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>

                            </form>
                        </div>

                    </div>

                </div>

            </div>
            
        </header>
    );
};

export default Header;