import { useNavigate } from "react-router-dom";
import { useAuthStore} from "../../../store/useAuthStore";

import { Settings, Bookmark, UserRoundPlus, SquarePlay } from "lucide-react";
import { Card, ListGroup } from "react-bootstrap";

const LeftPanel = () => {

    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    if(!authUser) {
        navigate("/");
        return null;
    }

    return (
        <>
            <Card style={{ width: '18rem' }} className="mb-4">
                <Card.Body>

                    <Card.Title className="text-center">{authUser.fullName}</Card.Title>
                    <Card.Subtitle className="text-muted text-center">
                        {authUser?.jobTitle}
                    </Card.Subtitle>
                    <p style={{ fontSize: "0.9em" }} className="text-center">
                        {authUser?.company}
                    </p>
                    
                    <Card.Text className="text-muted">
                       {authUser?.description}
                    </Card.Text>
    
                </Card.Body>
            </Card>

            <Card style={{ width: '18rem' }}>
                <ListGroup variant="flush">

                    <ListGroup.Item className="px-3 text-start">
                        <div className="d-flex align-items-center gap-3">
                            <SquarePlay color = "#797979" size={20}/>
                            <span className="text-muted">Learning</span>
                        </div>

                    </ListGroup.Item>

                    <ListGroup.Item className="px-3 text-start">
                        <div className="d-flex align-items-center gap-3">
                            <Bookmark color = "#797979" size={20}/>
                            <span className="text-muted">Bookmark</span>
                        </div>

                    </ListGroup.Item>

                    <ListGroup.Item className="px-3 text-start">
                        <div className="d-flex align-items-center gap-3">
                            <UserRoundPlus color = "#797979" size={20}/>
                            <span className="text-muted">Find colleagues</span>
                        </div>

                    </ListGroup.Item>

                    <ListGroup.Item className="px-3 text-start">
                        <div className="d-flex align-items-center gap-3">
                            <Settings color = "#797979" size={20}/>
                            <span className="text-muted">Settings</span>
                        </div>

                    </ListGroup.Item>

                 </ListGroup>
            </Card>
        </>
    );
};

export default LeftPanel;