import axios from "axios";

import { Card } from "react-bootstrap";
import { useState } from "react";

const LeftPanel = ({ authUser }) => {

    const [loading, setLoading] = useState(false);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            setLoading(true);
            const res = await axios.patch(
                "http://localhost:5000/api/auth/update-profile-picture",
                formData,
                { 
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            console.log("Updated profile picture:", res.data);
        } catch (err) {
            console.error("Failed to update profile picture:", err.response?.data || err.message);
            alert("Failed to update profile picture."); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Card style={{ width: '18rem', height: '20rem' }} className="mb-4 text-center shadow-sm">
                <Card.Body>

                    <div className="position-relative d-flex justify-content-center mb-3">

                        <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>

                            <img src={authUser?.profilePic || "/Images/avatar-placeholder.png"} style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", border: "2px solid #DEE2E6", opacity: loading ? 0.6 : 1 }} title="Click to change avatar" alt="Profile" />

                        </label>

                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none"}} />

                    </div>

                   <Card.Title>
                        {authUser?.fullName}
                   </Card.Title>

                    <Card.Subtitle className="text-muted">
                        {authUser?.jobTitle}
                    </Card.Subtitle>
                    <p style={{ fontSize: "0.9em" }}>
                        {authUser?.location}
                    </p>
                </Card.Body>
            </Card>

        </div>
    );
};

export default LeftPanel;