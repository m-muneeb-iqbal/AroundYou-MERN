import { Table, InputGroup, Form, Row, Col, Button, Badge, Spinner, Pagination } from "react-bootstrap";
import { Search, Trash2 } from "lucide-react";

import InitialsAvatar from "../../common/InitialsAvatar";
import { roleBadgeStyle } from "../drawer/DrawerHeader";

const UsersTable = ({
    users, totalUsers, totalPages, currentPage,
    search, roleFilter, loading, confirmDelete, isSuperAdmin,
    onSearchChange, onRoleFilterChange, onPageChange,
    onRowClick, onDeleteClick, onDeleteConfirm, onDeleteCancel,
}) => (

    <>

        {/* Filters */}
        <Row className="g-2 mb-3 align-items-center">

            <Col xs={12} md={7}>

                <InputGroup size="sm">

                    <InputGroup.Text style={{ backgroundColor: "#F5F5F5", border: "1px solid #E0E0E0", borderRight: "none" }}>
                        <Search size={14} color="#898C8F" />
                    </InputGroup.Text>

                    <Form.Control
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ backgroundColor: "#F5F5F5", border: "1px solid #E0E0E0", borderLeft: "none", boxShadow: "none", fontSize: "0.82rem" }}
                    />

                </InputGroup>

            </Col>

            <Col xs={8} md={3}>

                <Form.Select size="sm" value={roleFilter} onChange={(e) => onRoleFilterChange(e.target.value)} style={{ fontSize: "0.82rem", border: "1px solid #E0E0E0" }} >

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
                        {isSuperAdmin && <th></th>}
                    </tr>

                </thead>

                <tbody>

                    {users.length === 0 ? (

                        <tr>
                            <td colSpan={isSuperAdmin ? 5 : 4} className="text-center text-muted py-4">
                                No users found
                            </td>
                        </tr>

                    ) : (

                        users.map((user) => (

                            <tr key={user._id} style={{ cursor: "pointer" }} onClick={() => onRowClick(user._id)}>

                                <td>
                                    
                                    <div className="d-flex align-items-center gap-2">

                                        <InitialsAvatar name={user.fullName} profilePic={user.profilePic} size={32} />
                                        <div>
                                            <div className="fw-bold" style={{ color: "#04263D" }}>{user.fullName}</div>
                                            <div className="text-muted" style={{ fontSize: "0.72rem" }}>{user.email}</div>
                                        </div>

                                    </div>

                                </td>

                                <td className="text-muted align-middle">{user.location || "—"}</td>
                                <td className="align-middle">{user.friendCount ?? 0}</td>
                                <td className="align-middle">

                                    <Badge pill bg="none" style={{ ...roleBadgeStyle(user.role), fontSize: "0.65rem" }}>
                                        {user.role}
                                    </Badge>

                                </td>

                                {isSuperAdmin && (

                                    <td className="align-middle" onClick={(e) => e.stopPropagation()}>

                                        {confirmDelete === user._id ? (

                                            <div className="d-flex gap-1">

                                                <Button size="sm" variant="danger" style={{ fontSize: "0.72rem", padding: "2px 8px" }} onClick={(e) => { e.stopPropagation(); onDeleteConfirm(user._id); }}>
                                                    Confirm
                                                </Button>

                                                <Button size="sm" variant="outline-secondary" style={{ fontSize: "0.72rem", padding: "2px 8px" }} onClick={(e) => { e.stopPropagation(); onDeleteCancel(); }}>
                                                    Cancel
                                                </Button>

                                            </div>

                                        ) : (
                                            <Trash2 size={16} color="#dc3545" role="button" title="Delete user" onClick={(e) => { e.stopPropagation(); onDeleteClick(user._id); }} />
                                        )}

                                    </td>
                                )}

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

                        <Pagination.Item key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
                            {page}
                        </Pagination.Item>
                        
                    ))}

                </Pagination>

            </div>

        )}

    </>

);

export default UsersTable;