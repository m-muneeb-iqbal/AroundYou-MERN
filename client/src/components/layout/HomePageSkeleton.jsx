import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { House } from "lucide-react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import HeaderSkeleton from "./HeaderSkeleton";
import ProfileCard from "../../pages/HomePage/ProfileCard/ProfileCard";
import PersonCard from "../friends/PersonCard";

const HomePageSkeleton = () => (

    <Container>

        <HeaderSkeleton />

        <Row className="pt-5">

            {/* Left panel — mirrors LeftPanel with isLoading */}
            <Col lg={3} className="d-none d-lg-block">

                <ProfileCard isLoading />

                <Card className="d-none d-md-block w-100">

                    <ListGroup variant="flush">

                        {Array.from({ length: 4 }).map((_, i) => (

                            <ListGroup.Item key={i} className="px-3">
                                <Skeleton height={20} />
                            </ListGroup.Item>

                        ))}

                    </ListGroup>

                </Card>

            </Col>

            {/* Middle — Feed has no loading state, render it as-is */}
            <Col xs={12} lg={6} className="text-center">
            
                <div className="d-flex flex-column align-items-center justify-content-center py-5 rounded"
                    style={{ minHeight: "200px", border: "2px dashed #E0E0E0", color: "#C0C0C0" }}
                >
                    <House size={40} color="#C0C0C0" />
                    <p className="mt-3 mb-0" style={{ fontSize: "0.9rem" }}>Feed coming soon</p>

                </div>

            </Col>

            {/* Right panel — mirrors RightPanel with isLoading */}
            <Col lg={3} className="d-none d-lg-block">

                <Card className="border-0 shadow-sm">

                    <Card.Body className="p-3">

                        <Card.Title className="mb-3" style={{ fontSize: "0.95rem", color: "#04263D" }}>
                            People you may know
                        </Card.Title>

                        <ListGroup variant="flush">

                            {Array.from({ length: 4 }).map((_, i) => (
                                <PersonCard key={i} isLoading />
                            ))}
                            
                        </ListGroup>

                    </Card.Body>

                </Card>

            </Col>

        </Row>

    </Container>

);

export default HomePageSkeleton;