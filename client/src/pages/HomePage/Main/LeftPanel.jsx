import { useEffect, useState } from "react";
import axios from "axios";

import { Settings, Bookmark, UserRoundPlus, SquarePlay } from "lucide-react";
import { Card, ListGroup } from "react-bootstrap";

const LeftPanel = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/check", {
                withCredentials: true, // send cookie JWT
                });
                setUser(res.data); // res.data contains user object
            } catch (err) {
                console.error("Failed to fetch user:", err.response?.data || err.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            <Card style={{ width: '18rem' }} className="mb-4">
                <Card.Body>

                    <Card.Title>{loading ? "Loading..." : user ? user.fullName : "User not found"}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {loading ? "Loading..." : user ? user.jobTitle : "Job title not found"} at {loading ? "Loading..." : user ? user.company : "Company not found"}
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