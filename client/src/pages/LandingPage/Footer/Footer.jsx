import { Container, Row, Col } from "react-bootstrap";

import styles from "../../../styles/LandingPage/Footer/Footer.module.css";

const Footer = () => {

    return (

        <footer>

            <Container className="mt-0">

                <Row className={styles.footerSection1}>

                    <Col xs={12} md={4} className="d-flex justify-content-md-center">
                    
                        <p className="h1">About</p>

                    </Col>

                    <Col xs={12} md={7} className="d-flex flex-column justify-content-end">
                    
                        <p>
                            AROUNDYOU was created by Comsats Under-Graduate student who wanted to
                            create a AROUNDYOU community, a place to stay connected with their
                            university friends and segment university life onto one all-inclusive
                            platform.
                        </p>

                        <p>
                            A private and encrypted social media application to share content,
                            posts, stories, search for new friends, encrypted chat and make it
                            easier to schedule events with our RSVP feature.
                        </p>

                        <p>
                            AROUNDYOU was created for U, the university students, and alumni to stay
                            connected.
                        </p>

                        <p>
                            AROUNDYOU provides 100% User control over content, by allowing you to
                            select who sees your content and allowing you to decide for how
                            long the content will live before being deleted permanently off
                            our servers.
                        </p>

                        <p>
                            We look forward to growing AROUNDYOU and adding new features and
                            products over the next few months and would love to hear your
                            feedback, so please reach out to us.
                        </p>

                        <p>Welcome to our AROUNDYOU community,</p>
                        <p className="fw-bold">TEAM AROUNDYOU</p>

                    </Col>

                </Row>

            </Container>

            <Container fluid="xs" className={`px-5 ${styles.footerSection2}`}>

                <Row>

                    <Col xs={12} sm={8} lg={10} className="d-flex flex-column">
                    
                        <Col xs={12} sm={8} lg={10} className="d-flex justify-content-sm-start justify-content-center mt-3">
                        
                            <img src="../Images/notIcons/edyou-footer.svg" alt="aroundyou logo" className="img-fluid" height="100px"/>
                        
                        </Col>

                        <Col xs={12} sm={8} lg={10} className="d-flex justify-content-sm-start justify-content-center mt-3">
                        
                            <div>College Life. Stay Connected</div>
                        
                        </Col>

                        <Col xs={12} sm={8} lg={10} className="d-flex justify-content-sm-start justify-content-center mt-sm-3 mb-sm-5 mt-3 mb-1">
                        
                            <img src="../Images/notIcons/apple-button-footer.svg" alt="app store download button" className={`img-fluid ${styles.footerAppleButton}`} height="35px"/>
                        
                        </Col>
                    
                    </Col>

                    <Col xs={12} sm={4} lg={2} className="d-flex justify-content-sm-start justify-content-center">
                    
                        <ul className={`${styles.ul} nav flex-column align-items-sm-start align-items-center mt-sm-3 mt-1`}>

                            <li className="nav-item">

                                <a className={`nav-link ${styles.footerItems}`} href="#">
                                    Features
                                </a>

                            </li>
                        
                            <li className="nav-item">

                                <a className={`nav-link ${styles.footerItems}`} href="#">
                                    About Us
                                </a>

                            </li>
                        
                            <li className="nav-item">

                                <a className={`nav-link ${styles.footerItems}`} href="#">
                                    Schools
                                </a>

                            </li>
                        
                            <li className="nav-item ">

                                <a className={`nav-link ${styles.footerItems}`} href="#">
                                    Wishlist
                                </a>

                            </li>
                        
                            <li className="nav-item">

                                <a className={`nav-link ${styles.footerItems}`} href="#">
                                    Contact Us
                                </a>

                            </li>

                        </ul>
                    
                    </Col>

                </Row>

                <Row>

                    <Col xs={12} lg={9} className="d-flex justify-content-lg-start justify-content-center">

                        <p className={styles.noHoverPrivacyPolicy}>All rights reserved. AroundYOU © 2026</p>
                    
                    </Col>

                    <Col xs={12} lg={3} className="d-flex justify-content-center">

                        <a href="#" className={styles.footerItems}>Privacy Policy</a>
                        
                        <a href="#" className={styles.footerItems}>
                            <img src="../Images/icons/Globe.png" className={styles.footerItems} alt="globe"/>
                            English
                        </a>
                    
                    </Col>

                </Row>

            </Container>

        </footer>

    );

};

export default Footer;