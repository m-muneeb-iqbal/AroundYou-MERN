import { Row, Col } from "react-bootstrap";

const Layout = ({ left, middle, right }) => {
    return (
        <Row className="pt-5">
            {left && <Col xs={3}>{left}</Col>}
            {middle && <Col xs={6} className="text-center">{middle}</Col>}
            {right && <Col xs={3}>{right}</Col>}
        </Row>
  );
};

export default Layout;