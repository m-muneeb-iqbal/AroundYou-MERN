import { Row, Col } from "react-bootstrap";

import Header from "./Header";

const TwoRowsLayout = ({ top, bottom }) => {

    return (

        <>
        
            <Header/>
            
            <Row className="mt-1">
                {top && <Col xs={12} className="d-flex justify-content-center">{top}</Col>}
            </Row>

            <Row>
                {bottom && <Col xs={12}>{bottom}</Col>}
            </Row>
        
        </>

    );
};

export default TwoRowsLayout;