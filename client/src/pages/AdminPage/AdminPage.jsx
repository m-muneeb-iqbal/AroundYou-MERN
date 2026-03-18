import { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Table, Form, InputGroup, Button, Badge, Pagination, Spinner } from "react-bootstrap";
import { Search, Trash2, Users, MessageCircleMore, UserRoundPlus, Activity } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import InitialsAvatar from "../../components/common/InitialsAvatar";
import Header from "../../components/layout/Header";

const StatCard = ({ icon: Icon, label, value, color }) => (
    <Card className="border-0 shadow-sm h-100">
        <Card.Body className="d-flex align-items-center gap-3 p-3">
            <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: 48, height: 48, backgroundColor: `${color}18` }}
            >
                <Icon size={22} color={color} />
            </div>
            <div>
                <div className="text-muted" style={{ fontSize: "0.78rem" }}>{label}</div>
                <div className="fw-bold" style={{ fontSize: "1.3rem", color: "#04263D" }}>{value ?? "—"}</div>
            </div>
        </Card.Body>
    </Card>
);

const AdminPage = () => {

    const {
        stats,
        users,
        totalUsers,
        totalPages,
        currentPage,
        friendRequests,
        loading,
        fetchStats,
        fetchUsers,
        deleteUser,
        fetchFriendRequests,
        deleteFriendRequest,
    } = useAdminStore();

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [activeTab, setActiveTab] = useState("users"); // "users" | "requests"
    const [confirmDelete, setConfirmDelete] = useState(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchFriendRequests();
    }, []);

    // Debounced search
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchUsers({ q: search, role: roleFilter, page: 1 });
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [search, roleFilter]);

    const handlePageChange = (page) => {
        fetchUsers({ q: search, role: roleFilter, page });
    };

    const handleDelete = async (userId) => {
        await deleteUser(userId);
        setConfirmDelete(null);
    };

    return (
        <>
            <Header />
            <Container className="py-4">

                {/* Stats row */}
                <Row className="g-3 mb-4">
                    <Col xs={6} lg={3}>
                        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="#04263D" />
                    </Col>
                    <Col xs={6} lg={3}>
                        <StatCard icon={UserRoundPlus} label="Friendships" value={stats?.totalFriendships} color="#198754" />
                    </Col>
                    <Col xs={6} lg={3}>
                        <StatCard icon={MessageCircleMore} label="Messages" value={stats?.totalMessages} color="#5BC8F5" />
                    </Col>
                    <Col xs={6} lg={3}>
                        <StatCard icon={Activity} label="Pending Requests" value={stats?.totalPendingRequests} color="#f0ad4e" />
                    </Col>
                </Row>

                {/* Tabs */}
                <div className="d-flex gap-3 mb-3">
                    <Button
                        size="sm"
                        style={{
                            backgroundColor: activeTab === "users" ? "#04263D" : "transparent",
                            border: "1px solid #04263D",
                            color: activeTab === "users" ? "white" : "#04263D",
                        }}
                        onClick={() => setActiveTab("users")}
                    >
                        Users
                    </Button>
                    <Button
                        size="sm"
                        style={{
                            backgroundColor: activeTab === "requests" ? "#04263D" : "transparent",
                            border: "1px solid #04263D",
                            color: activeTab === "requests" ? "white" : "#04263D",
                        }}
                        onClick={() => setActiveTab("requests")}
                    >
                        Friend Requests
                        {friendRequests.length > 0 && (
                            <Badge pill bg="danger" className="ms-2" style={{ fontSize: "0.6rem" }}>
                                {friendRequests.length}
                            </Badge>
                        )}
                    </Button>
                </div>

                {/* Users tab */}
                {activeTab === "users" && (
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-3">

                            {/* Filters */}
                            <Row className="g-2 mb-3">
                                <Col xs={12} md={7}>
                                    <InputGroup size="sm">
                                        <InputGroup.Text style={{ backgroundColor: "#f5f5f5", border: "1px solid #e0e0e0", borderRight: "none" }}>
                                            <Search size={14} color="#898C8F" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by name..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            style={{ backgroundColor: "#f5f5f5", border: "1px solid #e0e0e0", borderLeft: "none", boxShadow: "none", fontSize: "0.82rem" }}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col xs={12} md={3}>
                                    <Form.Select
                                        size="sm"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        style={{ fontSize: "0.82rem", border: "1px solid #e0e0e0" }}
                                    >
                                        <option value="">All roles</option>
                                        <option value="User">Users</option>
                                        <option value="Admin">Admins</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={12} md={2} className="d-flex align-items-center">
                                    <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                                        {totalUsers} total
                                    </span>
                                </Col>
                            </Row>

                            {/* Table */}
                            {loading ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" size="sm" style={{ color: "#04263D" }} />
                                </div>
                            ) : (
                                <Table hover responsive style={{ fontSize: "0.85rem" }}>
                                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                                        <tr>
                                            <th>User</th>
                                            <th>Job Title</th>
                                            <th>Location</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center text-muted py-4">
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user._id}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <InitialsAvatar
                                                                name={user.fullName}
                                                                profilePic={user.profilePic}
                                                                size={32}
                                                            />
                                                            <div>
                                                                <div className="fw-bold" style={{ color: "#04263D" }}>
                                                                    {user.fullName}
                                                                </div>
                                                                <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted">{user.jobTitle || "—"}</td>
                                                    <td className="text-muted">{user.location || "—"}</td>
                                                    <td>
                                                        <Badge
                                                            pill
                                                            style={{
                                                                backgroundColor: "#04263D",
                                                                color: "#FFFFFF",
                                                                fontSize: "0.65rem",
                                                            }}
                                                        >
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-muted">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        {confirmDelete === user._id ? (
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    size="sm"
                                                                    variant="danger"
                                                                    style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                                                                    onClick={() => handleDelete(user._id)}
                                                                >
                                                                    Confirm
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-secondary"
                                                                    style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                                                                    onClick={() => setConfirmDelete(null)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Trash2
                                                                size={16}
                                                                color="#dc3545"
                                                                role="button"
                                                                title="Delete user"
                                                                onClick={() => setConfirmDelete(user._id)}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-3">
                                    <Pagination size="sm">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Pagination.Item
                                                key={page}
                                                active={page === currentPage}
                                                onClick={() => handlePageChange(page)}
                                                style={{ fontSize: "0.82rem" }}
                                            >
                                                {page}
                                            </Pagination.Item>
                                        ))}
                                    </Pagination>
                                </div>
                            )}

                        </Card.Body>
                    </Card>
                )}

                {/* Friend requests tab */}
                {activeTab === "requests" && (
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-3">
                            <Table hover responsive style={{ fontSize: "0.85rem" }}>
                                <thead style={{ backgroundColor: "#f8f9fa" }}>
                                    <tr>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Sent</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {friendRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-4">
                                                No pending requests
                                            </td>
                                        </tr>
                                    ) : (
                                        friendRequests.map((req) => (
                                            <tr key={req._id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <InitialsAvatar name={req.requester.fullName} profilePic={req.requester.profilePic} size={28} />
                                                        <span>{req.requester.fullName}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <InitialsAvatar name={req.recipient.fullName} profilePic={req.recipient.profilePic} size={28} />
                                                        <span>{req.recipient.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="text-muted">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <Trash2
                                                        size={16}
                                                        color="#dc3545"
                                                        role="button"
                                                        title="Remove request"
                                                        onClick={() => deleteFriendRequest(req._id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

            </Container>
        </>
    );
};

export default AdminPage;