import { Container, Row, Col } from "react-bootstrap";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomePageSkeleton = () => {

    return (

        <Container>

            {/* Header skeleton */}
            <Row className="py-3 align-items-center border-bottom">

                <Col xs={5} md={4} lg={3} className="d-flex align-items-center gap-2">

                    <Skeleton width={120} height={34} />

                </Col>

                <Col xs={7} md={8} lg={9} className="d-flex justify-content-end align-items-center gap-4 pe-3">

                    <Skeleton circle width={24} height={24} />
                    <Skeleton circle width={24} height={24} />
                    <Skeleton circle width={24} height={24} />
                    <Skeleton circle width={24} height={24} />
                    <Skeleton circle width={24} height={24} />

                </Col>

            </Row>

            <Row className="pt-5">

                {/* Left panel skeleton */}
                <Col lg={3} className="d-none d-lg-block">

                    {/* Profile card */}
                    <div className="mb-4 p-3 rounded shadow-sm">

                        <Skeleton width="60%" className="mb-2" />
                        <Skeleton width="40%" className="mb-1" />
                        <Skeleton width="30%" className="mb-3" />

                        <Skeleton count={3} />
                    </div>

                    {/* Nav items */}
                    <div className="rounded shadow-sm">

                        {Array.from({ length: 4 }).map((_, i) => (

                            <div key={i} className="px-3 py-2">
                                <Skeleton height={20} />
                            </div>
                        ))}

                    </div>

                </Col>

                {/* Middle skeleton */}
                <Col xs={12} lg={6}>
                    <Skeleton height={200} className="rounded" />
                </Col>

                {/* Right panel skeleton */}
                <Col lg={3} className="d-none d-lg-block">

                    <div className="p-3 rounded shadow-sm">

                        <Skeleton width="70%" className="mb-3" />

                        {Array.from({ length: 4 }).map((_, i) => (

                            <div key={i} className="d-flex align-items-center gap-2 py-2">
                                
                                <Skeleton circle width={36} height={36} />

                                <div className="flex-grow-1">
                                    <Skeleton width="60%" className="mb-1" />
                                    <Skeleton width="40%" />
                                </div>

                                <Skeleton circle width={32} height={32} />

                            </div>

                        ))}

                    </div>

                </Col>

            </Row>

        </Container>

    );
    
};

export default HomePageSkeleton;