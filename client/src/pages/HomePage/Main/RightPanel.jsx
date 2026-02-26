import { UserRoundPlus } from "lucide-react";
import { Card, ListGroup } from "react-bootstrap";

const RightPanel = () => {
    return (
        <>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    
                    <Card.Title>People you may know:</Card.Title>
                    <ListGroup as="ol" numbered variant="flush">

                        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start px-3 text-start"> 

                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Abdullah Rashid</div>
                                <span className="text-muted">Dispatcher</span>
                            </div>
                            <UserRoundPlus size={20} color="#04263D" role="button" title="Add friend" />

                        </ListGroup.Item>

                        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start px-3 text-start"> 

                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Bilal Aslam</div>
                                <span className="text-muted">PC Technician</span>
                            </div>
                            <UserRoundPlus size={20} color="#04263D" role="button" title="Add friend" />

                        </ListGroup.Item>

                        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start px-3 text-start"> 

                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Abdul Rafay</div>
                                <span className="text-muted">Deep Learning Engineer</span>
                            </div>
                            <UserRoundPlus size={20} color="#04263D" role="button" title="Add friend" />

                        </ListGroup.Item>

                    </ListGroup>

                </Card.Body>
                            
            </Card>
        </>
    );
};

export default RightPanel;