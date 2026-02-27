import { Container, Row, Col } from "react-bootstrap";

import styles from "../../../styles/LandingPage/Main/Section2.module.css";

const Section2 = () => {

    return (

        <Container fluid="xs" className={`pt-5 ${styles.section2}`}>

            <Row>

                <Col xs={12} className="d-flex justify-content-center cover-section">

                    <img src="../Images/notIcons/cover-brand-picture.png" className="img-fluid pt-5" alt="cover brand picture"/>

                </Col>

            </Row>

        </Container>

    );

};

export default Section2;