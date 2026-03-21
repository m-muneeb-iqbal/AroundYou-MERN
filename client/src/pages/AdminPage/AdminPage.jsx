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

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [activeTab, setActiveTab] = useState("users");
    const [confirmDelete, setConfirmDelete] = useState(null);
    const debounceRef = useRef(null);

    const { stats, users, totalUsers, totalPages, currentPage, friendRequests, loading, fetchStats, fetchUsers, deleteUser, fetchFriendRequests, deleteFriendRequest, fetchUserById, clearSelectedUser, selectedUser } = useAdminStore();

    useEffect(() => { fetchStats(); fetchUsers(); fetchFriendRequests(); }, []);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchUsers({ q: search, role: roleFilter, page: 1 }), 300);
        return () => clearTimeout(debounceRef.current);
    }, [search, roleFilter]);

    return (

        <>

            <Header />
            <Container className="py-4">

                <Row className="g-3 mb-4">
                    <Col xs={6} lg={3}><StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="#04263D" /></Col>
                    <Col xs={6} lg={3}><StatCard icon={UserRoundPlus} label="Friendships" value={stats?.totalFriendships} color="#198754" /></Col>
                    <Col xs={6} lg={3}><StatCard icon={MessageCircleMore} label="Conversations" value={stats?.totalConversations} color="#5BC8F5" /></Col>
                    <Col xs={6} lg={3}><StatCard icon={TrendingUp} label="New This Month" value={stats?.newUsersThisMonth} sub={`${stats?.newUsersThisWeek ?? 0} this week`} color="#f0ad4e" /></Col>
                </Row>

                <div className="d-flex gap-2 mb-3">

                    {["users", "requests"].map((tab) => (

                        <Button key={tab} size="sm" style={{ backgroundColor: activeTab === tab ? "#04263D" : "transparent", border: "1px solid #04263D", color: activeTab === tab ? "white" : "#04263D" }} onClick={() => setActiveTab(tab)}>
                            {tab === "users" ? "Users" : (<>Friend Requests {friendRequests.length > 0 && <Badge pill bg="danger" className="ms-2" style={{ fontSize: "0.6rem" }}>{friendRequests.length}</Badge>}</>)}
                        </Button>

                    ))}

                </div>

                <Card className="border-0 shadow-sm">

                    <Card.Body className="p-3">

                        {activeTab === "users" && (

                            <UsersTable
                                users={users} totalUsers={totalUsers} totalPages={totalPages} currentPage={currentPage}
                                search={search} roleFilter={roleFilter} loading={loading}
                                confirmDelete={confirmDelete} isSuperAdmin={isSuperAdmin}
                                onSearchChange={setSearch} onRoleFilterChange={setRoleFilter}
                                onPageChange={(page) => fetchUsers({ q: search, role: roleFilter, page })}
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