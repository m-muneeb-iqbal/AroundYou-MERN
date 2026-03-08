import { Row, Col } from "react-bootstrap";
import Header from "./Header";

const ThreeColumnLayout = ({ left, middle, right, showMessages = false, showSearch = false }) => {

    return (

        <>
            <Header showMessages={showMessages} showSearch={showSearch} />

            <Row className="pt-5">

                {/* Left — only at lg+ */}
                {left && (
                    <Col lg={3} className="d-none d-lg-block">
                        {left}
                    </Col>
                )}

                {/* Middle — full width below lg, 6 cols at lg+ */}
                {middle && (
                    <Col xs={12} lg={left || right ? 6 : 12} className="text-center">
                        {middle}
                    </Col>
                )}

                {/* Right — only at lg+ */}
                {right && (
                    <Col lg={3} className="d-none d-lg-block">
                        {right}
                    </Col>
                )}

            </Row>

        </>

    );
    
};

export default ThreeColumnLayout;