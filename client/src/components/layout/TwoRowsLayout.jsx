import { Row, Col } from "react-bootstrap";

import Header from "./Header";

const TwoRowsLayout = ({ top, bottom }) => {

    return (

        <>
        
            <Header/>
            
            <Row className="pt-5">
                {top && <Col xs={12} className="d-flex justify-content-center">{top}</Col>}
            </Row>

            <Row className="pt-0">
                {bottom && <Col xs={12}>{bottom}</Col>}
            </Row>
        
        </>

    );
};

export default TwoRowsLayout;