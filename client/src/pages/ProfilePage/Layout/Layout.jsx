import { Row, Col } from "react-bootstrap";

const Layout = ({ left, middle }) => {
    return (
        <Row className="pt-5">
            {left && <Col xs={12} className="d-flex justify-content-center">{left}</Col>}
            {middle && <Col xs={12}>{middle}</Col>}
        </Row>
    );
};

export default Layout;