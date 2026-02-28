import { useEffect } from "react";

import { UserRoundPlus } from "lucide-react";
import { Card, ListGroup } from "react-bootstrap";
import { useUserStore } from "../../../store/getUsers";

const RightPanel = () => {

    const { users, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        
        <>

            <Card style={{ width: '18rem' }}>

                <Card.Body>
                    
                    <Card.Title>People you may know:</Card.Title>

                    <ListGroup as="ol" numbered variant="flush">

                        {users.map((user) => (

                            <ListGroup.Item key={user._id} as="li" className="d-flex justify-content-between align-items-start px-3 text-start" >

                                <div className="ms-2 me-auto">

                                    <div className="fw-bold">{user.fullName}</div>
                                    <span className="text-muted">{user.jobTitle}</span>
                                    
                                </div>

                                <UserRoundPlus size={20} color="#04263D" role="button" title="Add friend" />

                            </ListGroup.Item>
                        ))}

                    </ListGroup>

                </Card.Body>
                            
            </Card>

        </>

    );

};

export default RightPanel;