import { Row, Col } from "react-bootstrap";

const Layout = ({ left, middle, right }) => {
    return (
        <Row className="pt-5">
            {left && <Col xs={12} md={3}>{left}</Col>}
            {middle && <Col xs={12} md={6} className="text-center">{middle}</Col>}
            {right && <Col xs={12} md={3}>{right}</Col>}
        </Row>
  );
};

export default Layout;