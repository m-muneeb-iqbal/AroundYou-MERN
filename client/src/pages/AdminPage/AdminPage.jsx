import { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { Users, UserRoundPlus, MessageCircleMore, TrendingUp } from "lucide-react";

import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";

import Header from "../../components/layout/Header";
import StatCard from "../../components/common/StatCard";

import UsersTable from "../../components/admin/table/UsersTable";
import FriendRequestsTable from "../../components/admin/table/FriendRequestsTable";
import UserDrawer from "../../components/admin/UserDrawer";

const AdminPage = () => {

    const { authUser } = useAuthStore();
    const isSuperAdmin = authUser?.isSuperAdmin;

    const {
        stats, users, totalUsers, totalPages, currentPage, currentLimit,
        friendRequests, loading,
        fetchStats, fetchUsers, deleteUser, fetchFriendRequests,
        deleteFriendRequest, fetchUserById, clearSelectedUser, selectedUser,
    } = useAdminStore();

    // ── Filter/sort state
    const [search, setSearch]               = useState("");
    const [roleFilter, setRoleFilter]       = useState("");
    const [location, setLocation]           = useState("");
    const [sortBy, setSortBy]               = useState("createdAt");
    const [sortOrder, setSortOrder]         = useState("desc");
    const [limit, setLimit]                 = useState(10);

    const [activeTab, setActiveTab]         = useState("users");
    const [confirmDelete, setConfirmDelete] = useState(null);
    const debounceRef                       = useRef(null);

    useEffect(() => { fetchStats(); fetchUsers(); fetchFriendRequests(); }, []);

    // ── Debounce all filter/sort changes together
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchUsers({ q: search, role: roleFilter, location, sortBy, sortOrder, page: 1, limit });
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [search, roleFilter, location, sortBy, sortOrder, limit]);

    const handleSortChange = (field, order) => {
        setSortBy(field);
        setSortOrder(order);
    };

    const handlePageChange = (page) => {
        fetchUsers({ q: search, role: roleFilter, location, sortBy, sortOrder, page, limit });
    };

    return (

        <>
            <Container>

                <Header />

                <Row className="g-3 mb-4">
                    <Col xs={6} lg={3}><StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="#04263D" /></Col>
                    <Col xs={6} lg={3}><StatCard icon={UserRoundPlus} label="Friendships" value={stats?.totalFriendships} color="#198754" /></Col>
                    <Col xs={6} lg={3}><StatCard icon={MessageCircleMore} label="Conversations" value={stats?.totalConversations} color="#5BC8F5" /></Col>
                    <Col xs={6} lg={3}><StatCard icon={TrendingUp} label="New This Month" value={stats?.newUsersThisMonth} sub={`${stats?.newUsersThisWeek ?? 0} this week`} color="#f0ad4e" /></Col>
                </Row>

                <Card className="border-0 shadow-sm">

                    <Card.Header className="bg-white border-bottom d-flex gap-2 px-3 py-2">

                        {["users", "requests"].map((tab) => (

                            <Button key={tab} size="sm" style={{ backgroundColor: activeTab === tab ? "#04263D" : "transparent", border: "1px solid #04263D", color: activeTab === tab ? "white" : "#04263D", }} onClick={() => setActiveTab(tab)} >

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

                    </Card.Header>

                    <Card.Body className="p-3">

                        {activeTab === "users" && (

                            <UsersTable
                                users={users} totalUsers={totalUsers}
                                totalPages={totalPages} currentPage={currentPage}
                                currentLimit={currentLimit || limit}
                                search={search} roleFilter={roleFilter}
                                location={location}
                                sortBy={sortBy} sortOrder={sortOrder}
                                loading={loading} confirmDelete={confirmDelete}
                                isSuperAdmin={isSuperAdmin}
                                onSearchChange={setSearch}
                                onRoleFilterChange={setRoleFilter}
                                onLocationChange={setLocation}
                                onSortChange={handleSortChange}
                                onLimitChange={setLimit}
                                onPageChange={handlePageChange}
                                onRowClick={fetchUserById}
                                onDeleteClick={setConfirmDelete}
                                onDeleteConfirm={async (userId) => { await deleteUser(userId); setConfirmDelete(null); }}
                                onDeleteCancel={() => setConfirmDelete(null)}
                            />

                        )}
                        {activeTab === "requests" && (
                            <FriendRequestsTable friendRequests={friendRequests} onDelete={deleteFriendRequest} />
                        )}

                    </Card.Body>

                </Card>

            </Container>

            {selectedUser && <UserDrawer onClose={clearSelectedUser} />}

        </>

    );

};

export default AdminPage;