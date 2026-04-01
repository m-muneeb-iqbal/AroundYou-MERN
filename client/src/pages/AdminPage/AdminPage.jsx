import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { Users, UserRoundPlus, MessageCircleMore, TrendingUp } from "lucide-react";

import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useAdminFilters } from "../../hooks/useAdminFilters";

import Header from "../../components/layout/Header";
import StatCard from "../../components/common/StatCard";

import UsersTable from "../../components/admin/table/UsersTable";
import FriendRequestsTable from "../../components/admin/table/FriendRequestsTable";
import UserDrawer from "../../components/admin/UserDrawer";

const STAT_CARDS_CONFIG = [
    { icon: Users, label: "Total Users", key: "totalUsers", color: "#04263D" },
    { icon: UserRoundPlus, label: "Friendships", key: "totalFriendships", color: "#198754" },
    { icon: MessageCircleMore, label: "Conversations", key: "totalConversations", color: "#5BC8F5" },
    { icon: TrendingUp, label: "New This Month", key: "newUsersThisMonth", color: "#f0ad4e", hasSub: true },
];

const TABS = [
    { id: "users", label: "Users" },
    { id: "requests", label: "Friend Requests" },
];

const AdminPage = () => {
    const { authUser } = useAuthStore();
    const isSuperAdmin = authUser?.isSuperAdmin;

    const {
        stats, users, totalUsers, totalPages, currentPage, currentLimit,
        friendRequests,
        fetchStats, fetchUsers, fetchFriendRequests,
        deleteFriendRequest, fetchUserById, clearSelectedUser, selectedUser,
    } = useAdminStore();

    const [activeTab, setActiveTab] = useState("users");
    const filters = useAdminFilters(fetchUsers);

    useEffect(() => { 
        fetchStats(); 
        fetchUsers(); 
        fetchFriendRequests(); 
    }, []);

    return (
        <>
            <Container>
                <Header />

                <Row className="g-3 mb-4">
                    {STAT_CARDS_CONFIG.map((card) => (
                        <Col key={card.key} xs={6} lg={3}>
                            <StatCard 
                                icon={card.icon} 
                                label={card.label} 
                                value={stats?.[card.key]} 
                                color={card.color}
                                {...(card.hasSub && { sub: `${stats?.newUsersThisWeek ?? 0} this week` })}
                            />
                        </Col>
                    ))}
                </Row>

                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom d-flex gap-2 px-3 py-2">
                        {TABS.map((tab) => (
                            <Button 
                                key={tab.id} 
                                size="sm" 
                                onClick={() => setActiveTab(tab.id)}
                                style={{ 
                                    backgroundColor: activeTab === tab.id ? "#04263D" : "transparent", 
                                    border: "1px solid #04263D", 
                                    color: activeTab === tab.id ? "white" : "#04263D",
                                }}
                            >
                                {tab.label}
                                {tab.id === "requests" && friendRequests.length > 0 && (
                                    <Badge pill bg="danger" className="ms-2" style={{ fontSize: "0.6rem" }}>
                                        {friendRequests.length}
                                    </Badge>
                                )}
                            </Button>
                        ))}
                    </Card.Header>

                    <Card.Body className="p-3">
                        {activeTab === "users" && (
                            <UsersTable
                                users={users} 
                                totalUsers={totalUsers}
                                totalPages={totalPages} 
                                currentPage={currentPage}
                                currentLimit={currentLimit || filters.limit}
                                search={filters.search} 
                                roleFilter={filters.roleFilter}
                                location={filters.location}
                                sortBy={filters.sortBy} 
                                sortOrder={filters.sortOrder}
                                isSuperAdmin={isSuperAdmin}
                                onSearchChange={filters.setSearch}
                                onRoleFilterChange={filters.setRoleFilter}
                                onLocationChange={filters.setLocation}
                                onSortChange={filters.handleSortChange}
                                onLimitChange={filters.setLimit}
                                onPageChange={filters.handlePageChange}
                                onRowClick={fetchUserById}
                            />
                        )}
                        {activeTab === "requests" && (
                            <FriendRequestsTable 
                                friendRequests={friendRequests} 
                                onDelete={deleteFriendRequest} 
                            />
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {selectedUser && <UserDrawer onClose={clearSelectedUser} />}
        </>
    );
};

export default AdminPage;