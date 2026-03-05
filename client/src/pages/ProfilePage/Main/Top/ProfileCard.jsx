import { Card } from "react-bootstrap";

const ProfileCard = ({ profilePic, fullName, jobTitle, location, onAvatarClick, loading }) => (

    <Card border="light" style={{ width: "17.98rem", height: "18.71rem" }} className="mb-4 text-center shadow">

        <Card.Body>

            <div className="position-relative d-flex justify-content-center mb-3">

                <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>

                    <img
                        src={profilePic || "/Images/avatar-placeholder.png"}
                        style={{
                            width: "10rem", height: "10rem",
                            borderRadius: "50%", objectFit: "cover",
                            border: "2px solid #DEE2E6",
                            opacity: loading ? 0.6 : 1,
                        }}
                        title="Click to change avatar"
                        alt="Profile"
                    />

                </label>

                <input id="avatar-upload" type="file" accept="image/*" onChange={onAvatarClick} style={{ display: "none" }} />

            </div>
            
            <Card.Title>{fullName}</Card.Title>
            <Card.Subtitle className="text-muted">{jobTitle}</Card.Subtitle>

            <p style={{ fontSize: "0.9em" }}>{location}</p>

        </Card.Body>

    </Card>
    
);

export default ProfileCard;