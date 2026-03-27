import { Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AVATAR_SIZE = "10rem";

const ProfileCard = ({ profilePic, fullName, headline, location, onAvatarClick, loading }) => (

    <Card border="light" className="mb-4 text-center shadow" style={{ width: "100%", maxWidth: "20rem" }}>

        <Card.Body>

            {/* Profile Picture */}
            <div className="d-flex justify-content-center mb-3">

                {loading ? (

                    <Skeleton circle height={AVATAR_SIZE} width={AVATAR_SIZE} />

                ) : (

                    <label htmlFor="avatar-upload" style={{ cursor: "pointer", margin: 0 }}>

                        <img
                            src={profilePic || "/Images/avatar-placeholder.png"}
                            style={{
                                width: AVATAR_SIZE, height: AVATAR_SIZE,
                                borderRadius: "50%", objectFit: "cover",
                                border: "2px solid #DEE2E6",
                            }}
                            title="Click to change avatar"
                            alt="Profile"
                        />

                    </label>

                )}

                <input id="avatar-upload" type="file" accept="image/*" onChange={onAvatarClick} style={{ display: "none" }} />

            </div>

            {/* Full Name */}
            <Card.Title className="mb-1">
                {loading ? <Skeleton width="60%" /> : fullName}
            </Card.Title>

            {/* Headline */}
            <Card.Subtitle className="text-muted mb-1 small">
                {loading ? <Skeleton width="40%" /> : headline}
            </Card.Subtitle>

            {/* Location */}
            {loading ? (

                <p className="small text-muted mb-0"><Skeleton width="50%" /></p>

            ) : location ? (

                <p className="small text-muted mb-0">{location}</p>

            ) : null}

        </Card.Body>

    </Card>

);

export default ProfileCard;