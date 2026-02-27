import { Row, Col } from "react-bootstrap";

const Layout = ({ left, middle }) => {
    return (
        <Row className="pt-5">
            {left && <Col xs={3}>{left}</Col>}
            {middle && <Col xs={9}>{middle}</Col>}
        </Row>
  );
};

export default Layout;