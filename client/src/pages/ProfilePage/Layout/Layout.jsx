import { Row, Col } from "react-bootstrap";

const Layout = ({ top, bottom }) => {
    return (
        <Row className="pt-5">
            {top && <Col xs={12} className="d-flex justify-content-center">{top}</Col>}
            {bottom && <Col xs={12}>{bottom}</Col>}
        </Row>
    );
};

export default Layout;