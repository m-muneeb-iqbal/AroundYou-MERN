import { Row, Col } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HeaderSkeleton = () => (
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
);

export default HeaderSkeleton;