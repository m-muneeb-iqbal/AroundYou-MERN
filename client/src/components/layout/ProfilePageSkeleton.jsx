import { Container, Row, Col } from "react-bootstrap";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import HeaderSkeleton from "./HeaderSkeleton";

const ProfilePageSkeleton = () => {

    return (

        <Container>

            {/* Header skeleton */}
            <HeaderSkeleton />

            {/* Top row — ProfileCard skeleton */}
            <Row className="mt-1">

                <Col xs={12} className="d-flex justify-content-center">

                    <div className="mb-4 text-center shadow p-3 rounded" style={{ width: "17.98rem", height: "18.71rem" }} >

                        {/* Avatar — matches 10rem circle */}
                        <div className="d-flex justify-content-center mb-3">
                            <Skeleton circle width={160} height={160} />
                        </div>

                        {/* fullName */}
                        <Skeleton width="60%" height={22} className="mb-2" />

                        {/* headline */}
                        <Skeleton width="45%" height={16} className="mb-2" />

                        {/* location */}
                        <Skeleton width="35%" height={14} />

                    </div>

                </Col>

            </Row>

            {/* Bottom row — tabs + form skeleton */}
            <Row className="mt-3">

                <Col xs={12}>

                    {/* Tab bar */}
                    <div className="d-flex gap-2 mb-4">

                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} width={140} height={38} className="rounded" />
                        ))}

                    </div>

                    {/* Form fields */}
                    <div className="d-flex flex-column gap-3">

                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} height={42} className="rounded" />
                        ))}

                    </div>

                </Col>

            </Row>

        </Container>

    );
    
};

export default ProfilePageSkeleton;