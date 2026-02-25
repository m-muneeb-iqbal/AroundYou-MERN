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
        <div>
            <Card style={{ width: '18rem' }} className="mb-4">
                <Card.Body>

                    <Card.Title>{authUser ? authUser.fullName : "User not found"}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {authUser ? authUser.jobTitle : "Job title not found"} at {authUser ? authUser.company : "Company not found"}
                    </Card.Subtitle>
                    
                    <Card.Text className="text-muted">
                        Computer Science graduate with experience in Flutter, MERN Stack and Laravel.
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
        </div>
    );
};

export default LeftPanel;