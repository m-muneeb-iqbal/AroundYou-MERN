import { Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

const AVATAR_SIZE = 110;
const BRAND_COLOR = "#04263D";

const ProfileCard = ({ user, isLoading, profilePath = "/profile" }) => {

    const navigate = useNavigate();

    const handleMouseEnter = (e) => {
        e.currentTarget.parentElement.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.parentElement.style.boxShadow = "none";
    };

    return (

        <Card className="d-none d-md-block mb-4 w-100">

            <Card.Body className="px-3 py-3" onClick={() => navigate(profilePath)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: "pointer", transition: "all 0.2s ease" }} >

                {/* Profile Picture */}
                <div className="mb-2 d-flex justify-content-center">

                    {isLoading ? (

                        <Skeleton circle height={AVATAR_SIZE} width={AVATAR_SIZE} />

                    ) : (

                        <img
                            src={user?.profilePic || "/Images/avatar-placeholder.png"}
                            alt={user?.fullName}
                            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: "50%", objectFit: "cover", border: "2px solid #DEE2E6" }}
                        />

                    )}

                </div>

                {/* Full Name */}
                <Card.Title className="fw-semibold mb-1 text-start fs-5">
                    {isLoading ? <Skeleton width="60%" /> : user?.fullName}
                </Card.Title>

                {/* Headline */}
                <Card.Subtitle className="text-muted mb-1 text-start small">
                    {isLoading ? <Skeleton width="40%" /> : user?.headline}
                </Card.Subtitle>

                {/* Company */}
                {isLoading ? (

                    <p className="text-muted mb-3 text-start small"><Skeleton width="50%" /></p>

                ) : user?.company ? (

                    <p className="text-muted mb-3 text-start small">
                        {user.company}
                    </p>

                ) : null}

                {/* Description */}
                {isLoading ? (

                    <Card.Text className="text-muted mb-1 text-start" style={{ fontSize: "0.78rem" }}><Skeleton count={3} /></Card.Text>

                ) : user?.description ? (

                    <Card.Text className="text-muted mb-1 text-start" style={{ fontSize: "0.80rem" }}>{user.description}</Card.Text>

                ) : null}

                {/* Incomplete Profile Indicator */}
                {!isLoading && (!user?.description || !user?.headline) && (

                    <div className="mt-2 text-start" style={{ fontSize: "0.78rem", color: BRAND_COLOR, textDecoration: "underline" }} >
                        Complete your profile →
                    </div>

                )}

            </Card.Body>

        </Card>

    );

};

export default ProfileCard;