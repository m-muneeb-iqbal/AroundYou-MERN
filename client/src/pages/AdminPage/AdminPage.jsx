/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";

import { Container, Row, Col, Card, Table, Form, InputGroup, Button, Badge, Pagination, Spinner } from "react-bootstrap";
import { Search, Trash2, Users, UserRoundPlus, MessageCircleMore, TrendingUp } from "lucide-react";

import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";

import InitialsAvatar from "../../components/common/InitialsAvatar";
import Header from "../../components/layout/Header";
import UserDrawer from "../../components/admin/UserDrawer";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (

    <Card className="border-0 shadow-sm h-100">

        <Card.Body className="d-flex align-items-center gap-3 p-3">

            <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: 48, height: 48, backgroundColor: `${color}18` }}>
                <Icon size={22} color={color} />
            </div>

            <>
                <div className="text-muted" style={{ fontSize: "0.78rem" }}>{label}</div>
                <div className="fw-bold" style={{ fontSize: "1.3rem", color: "#04263D" }}>
                    {value ?? "—"}
                </div>

                {sub && (
                    <div style={{ fontSize: "0.7rem", color: "#898C8F" }}>{sub}</div>
                )}

            </>

        </Card.Body>

    </Card>

);

const roleBadgeStyle = (role) => {
    if (role === "SuperAdmin") return { backgroundColor: "#6f42c1", color: "white" };
    if (role === "Admin") return { backgroundColor: "#04263D", color: "white" };
    return { backgroundColor: "#e0e0e0", color: "#555" };
};

const AdminPage = () => {

    const { authUser } = useAuthStore();
    const isSuperAdmin = authUser?.isSuperAdmin;

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
        fetchUserById, 
        clearSelectedUser, 
        selectedUser
    } = useAdminStore();

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [activeTab, setActiveTab] = useState("users");
    const [confirmDelete, setConfirmDelete] = useState(null);
    const debounceRef = useRef(null);
    const handleRowClick = async (userId) => {
        await fetchUserById(userId);
    };

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchFriendRequests();
    }, []);

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

                {/* Stats */}
                <Row className="g-3 mb-4">

                    <Col xs={6} lg={3}>
                        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="#04263D" />
                    </Col>

                    <Col xs={6} lg={3}>
                        <StatCard icon={UserRoundPlus} label="Friendships" value={stats?.totalFriendships} color="#198754" />
                    </Col>

                    <Col xs={6} lg={3}>
                        <StatCard icon={MessageCircleMore} label="Conversations"  value={stats?.totalConversations} color="#5BC8F5" />
                    </Col>

                    <Col xs={6} lg={3}>
                        <StatCard icon={TrendingUp} label="New This Month" value={stats?.newUsersThisMonth} sub={`${stats?.newUsersThisWeek ?? 0} this week`} color="#F0AD4E" />
                    </Col>

                </Row>

                {/* Tabs */}
                <div className="d-flex gap-2 mb-3">

                    {["users", "requests"].map((tab) => (

                        <Button
                            key={tab}
                            size="sm"
                            style={{
                                backgroundColor: activeTab === tab ? "#04263D" : "transparent",
                                border: "1px solid #04263D",
                                color: activeTab === tab ? "white" : "#04263D",
                                textTransform: "capitalize",
                            }}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "users" ? "Users" : (

                                <>
                                    Friend Requests
                                    {friendRequests.length > 0 && (
                                        <Badge pill bg="danger" className="ms-2" style={{ fontSize: "0.6rem" }}>
                                            {friendRequests.length}
                                        </Badge>
                                    )}
                                </>

                            )}

                        </Button>

                    ))}

                </div>

                {/* Users tab */}
                {activeTab === "users" && (

                    <Card className="border-0 shadow-sm">

                        <Card.Body className="p-3">

                            {/* Filters */}
                            <Row className="g-2 mb-3 align-items-center">

                                <Col xs={12} md={7}>

                                    <InputGroup size="sm">

                                        <InputGroup.Text style={{ backgroundColor: "#F5F5F5", border: "1px solid #E0E0E0", borderRight: "none" }}>
                                            <Search size={14} color="#898C8F" />
                                        </InputGroup.Text>

                                        <Form.Control type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
                                            style={{ backgroundColor: "#F5F5F5", border: "1px solid #E0E0E0", borderLeft: "none", boxShadow: "none", fontSize: "0.82rem" }}
                                        />
                                        
                                    </InputGroup>

                                </Col>

                                <Col xs={8} md={3}>

                                    <Form.Select size="sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ fontSize: "0.82rem", border: "1px solid #e0e0e0" }}>
                                        <option value="">All roles</option>
                                        <option value="User">Users</option>
                                        <option value="Admin">Admins</option>
                                        {isSuperAdmin && <option value="SuperAdmin">Super Admins</option>}
                                    </Form.Select>

                                </Col>

                                <Col xs={4} md={2} className="text-muted" style={{ fontSize: "0.78rem" }}>
                                    {totalUsers} total
                                </Col>

                            </Row>

                            {/* Table */}
                            {loading ? (

                                <div className="text-center py-4">
                                    <Spinner animation="border" size="sm" style={{ color: "#04263D" }} />
                                </div>

                            ) : (

                                <Table hover responsive style={{ fontSize: "0.85rem" }}>

                                    <thead style={{ backgroundColor: "#F8F9FA" }}>

                                        <tr>
                                            <th>User</th>
                                            <th>Location</th>
                                            <th>Friends</th>
                                            <th>Role</th>
                                            <th></th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {users.length === 0 ? (

                                            <tr>
                                                <td colSpan={5} className="text-center text-muted py-4">
                                                    No users found
                                                </td>
                                            </tr>

                                        ) : (

                                            users.map((user) => (

                                                <tr key={user._id} style={{ cursor: "pointer" }} onClick={() => handleRowClick(user._id)} >

                                                    <td>

                                                        <div className="d-flex align-items-center gap-2">

                                                            <InitialsAvatar name={user.fullName} profilePic={user.profilePic} size={32} />
                                                            <>

                                                                <div className="fw-bold" style={{ color: "#04263D" }}>
                                                                    {user.fullName}
                                                                </div>
                                                                <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                                                                    {user.email}
                                                                </div>

                                                            </>

                                                        </div>

                                                    </td>

                                                    <td className="text-muted align-middle">
                                                        {user.location || "—"}
                                                    </td>

                                                    <td className="align-middle">
                                                        {user.friendCount ?? 0}
                                                    </td>

                                                    <td className="align-middle">
                                                        <Badge pill bg="none" style={{ ...roleBadgeStyle(user.role), fontSize: "0.65rem" }}>
                                                            {user.role}
                                                        </Badge>
                                                    </td>

                                                    <td className="align-middle" onClick={(e) => e.stopPropagation()}>

                                                        {isSuperAdmin && (

                                                            confirmDelete === user._id ? (

                                                                <div className="d-flex gap-1">
                                                                    <Button size="sm" variant="danger" style={{ fontSize: "0.72rem", padding: "2px 8px" }} onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}>Confirm</Button>
                                                                    <Button size="sm" variant="outline-secondary" style={{ fontSize: "0.72rem", padding: "2px 8px" }} onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }}>Cancel</Button>
                                                                </div>

                                                            ) : (
                                                                <Trash2 size={16} color="#dc3545" role="button" title="Delete user" onClick={(e) => { e.stopPropagation(); setConfirmDelete(user._id); }} />
                                                            )

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

                                            <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)} >
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

                                                <td className="text-muted align-middle">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </td>

                                                <td className="align-middle">

                                                    <Trash2 size={16} color="#DC3545" role="button" title="Remove request" onClick={() => deleteFriendRequest(req._id)} />
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
            {selectedUser && (
                <UserDrawer onClose={clearSelectedUser} />
            )}

        </>

    );
    
};

export default AdminPage;