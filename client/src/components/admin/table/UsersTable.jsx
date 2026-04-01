import { Table, InputGroup, Form, Row, Col, Badge, Button } from "react-bootstrap";
import { Search, ArrowUp, ArrowDown, ArrowUpDown, X } from "lucide-react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import PlaceholderAvatar from "../../common/PlaceholderAvatar";
import { roleBadgeStyle } from "../drawer/DrawerHeader";

const paginationButtonStyles = `
  .pagination-btn:not(:disabled):hover {
    background-color: #e0e0e0 !important;
  }
`;

const TABLE_WIDTHS = [
    ["62%", "42%", "55%", "52%", "44%"],
    ["50%", "35%", "40%", "58%", "40%"],
    ["68%", "50%", "45%", "46%", "48%"],
    ["55%", "38%", "50%", "62%", "36%"],
    ["60%", "45%", "48%", "50%", "42%"],
];

const TableRowSkeleton = ({ index = 0 }) => {

    const [w1, w2, w3, w4, w5] = TABLE_WIDTHS[index % TABLE_WIDTHS.length];

    return (

        <tr>

            <td style={{ verticalAlign: "middle", padding: "10px 8px" }}>

                <div className="d-flex align-items-center gap-2">

                    <Skeleton circle width={32} height={32} />

                    <div className="flex-grow-1">
                        <Skeleton width={w1} height={11} />
                        <Skeleton width={w2} height={9} />
                    </div>

                </div>

            </td>

            <td style={{ verticalAlign: "middle" }}><Skeleton width={w3} height={11} /></td>
            <td style={{ verticalAlign: "middle" }}><Skeleton width={28} height={11} /></td>
            <td style={{ verticalAlign: "middle" }}><Skeleton width={w4} height={20} borderRadius={50} /></td>
            <td style={{ verticalAlign: "middle" }}><Skeleton width={w5} height={11} /></td>

        </tr>
    );


};

// ── Highlight matching text in a string
const Highlighted = ({ text = "", query = "" }) => {

    if (!query.trim()) return <>{text}</>;
    const regex = new RegExp(`(${query.trim()})`, "gi");
    const parts = text.split(regex);

    return (
        <>

            {parts.map((part, i) =>
                regex.test(part)
                    ? <mark key={i} style={{ backgroundColor: "#fff3cd", padding: 0 }}>{part}</mark>
                    : part
            )}

        </>
    );

};

// ── Sortable column header
const SortHeader = ({ label, field, sortBy, sortOrder, onSort }) => {

    const isActive = sortBy === field;
    return (

        <th role="button" style={{ userSelect: "none", whiteSpace: "nowrap" }} onClick={() => onSort(field)} >

            <span className="d-flex align-items-center gap-1">

                {label}
                {isActive
                    ? sortOrder === "asc"
                        ? <ArrowUp size={13} color="#04263D" />
                        : <ArrowDown size={13} color="#04263D" />
                    : <ArrowUpDown size={13} color="#CCCCCC" />
                }

            </span>

        </th>

    );

};

// ── Active filter pill
const FilterPill = ({ label, onRemove }) => (

    <span className="d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1" style={{ backgroundColor: "#e8f0fe", fontSize: "0.72rem", color: "#04263D" }} >
        {label}
        <X size={11} role="button" onClick={onRemove} />
    </span>

);

const UsersTable = ({
    users, totalUsers, totalPages, currentPage, currentLimit,
    search, roleFilter, location,
    sortBy, sortOrder, loading, isSuperAdmin,
    onSearchChange, onRoleFilterChange, onLocationChange,
    onSortChange, onLimitChange, onPageChange,
    onRowClick,
}) => {

    // Active filters for pill display
    const activeFilters = [
        roleFilter && { key: "role", label: `Role: ${roleFilter}`, onRemove: () => onRoleFilterChange("") },
        location && { key: "location", label: `Location: ${location}`, onRemove: () => onLocationChange("") },
    ].filter(Boolean);

    const handleSort = (field) => {

        if (sortBy === field) {
            onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
        } else {
            onSortChange(field, "asc");
        }

    };

    return (

        <>
            <style>{paginationButtonStyles}</style>
            {/* ── Search + result count */}
            <Row className="g-2 mb-2 align-items-center">

                <Col xs={12} md={5}>

                    <InputGroup size="sm">

                        <InputGroup.Text style={{ backgroundColor: "#F5F5F5", border: "1px solid #E0E0E0", borderRight: "none" }}>
                            <Search size={14} color="#898C8F" />
                        </InputGroup.Text>

                        <Form.Control
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            style={{ backgroundColor: "#F5F5F5", border: "1px solid #E0E0E0", borderLeft: "none", boxShadow: "none", fontSize: "0.82rem" }}
                        />

                    </InputGroup>

                </Col>

                {/* Role filter */}
                <Col xs={5} md={3}>

                    <Form.Select size="sm" value={roleFilter} onChange={(e) => onRoleFilterChange(e.target.value)} style={{ fontSize: "0.82rem", border: "1px solid #E0E0E0" }}>
                        <option value="">All roles</option>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        {isSuperAdmin && <option value="SuperAdmin">Super Admin</option>}
                    </Form.Select>

                </Col>

                {/* Location filter */}
                <Col xs={5} md={3}>

                    <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Filter by location..."
                        value={location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        style={{ fontSize: "0.82rem", border: "1px solid #E0E0E0" }}
                    />

                </Col>

                {/* Items per page + result count */}
                <Col xs={2} md={1} className="d-flex align-items-center gap-2 justify-content-end">

                    <Form.Select size="sm" value={currentLimit} onChange={(e) => onLimitChange(Number(e.target.value))} style={{ fontSize: "0.78rem", border: "1px solid #E0E0E0", width: "70px" }} >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </Form.Select>

                </Col>

            </Row>

            {/* ── Result count + active filter pills */}
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">

                <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                    {totalUsers} result{totalUsers !== 1 ? "s" : ""}
                    {search && ` for "${search}"`}
                </span>

                {activeFilters.map((f) => (
                    <FilterPill key={f.key} label={f.label} onRemove={f.onRemove} />
                ))}

            </div>

            {/* ── Table */}
            <Table hover responsive style={{ fontSize: "0.85rem" }}>

                <thead style={{ backgroundColor: "#F8F9FA" }}>

                    <tr>
                        <SortHeader label="User" field="fullName" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                        <th>Location</th>
                        <SortHeader label="Friends" field="friendCount" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                        <SortHeader label="Role" field="role" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                        <SortHeader label="Joined" field="createdAt" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    </tr>

                </thead>

                <tbody>

                    {loading ? (

                        <>{Array.from({ length: currentLimit || 10 }).map((_, i) => <TableRowSkeleton key={i} index={i} />)}</>

                    ) : users.length === 0 ? (

                        <tr>
                            <td colSpan={isSuperAdmin ? 6 : 5} className="text-center text-muted py-4">
                                No users found
                            </td>
                        </tr>

                    ) : (

                        users.map((user) => (

                            <tr key={user._id} style={{ cursor: "pointer" }} onClick={() => onRowClick(user._id)}>

                                <td>

                                    <div className="d-flex align-items-center gap-2">

                                        <PlaceholderAvatar name={user.fullName} profilePic={user.profilePic} size={32} />
                                        <div>

                                            <div className="fw-bold" style={{ color: "#04263D" }}>
                                                <Highlighted text={user.fullName} query={search} />
                                            </div>

                                            <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                                                <Highlighted text={user.email} query={search} />
                                            </div>

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

                                <td className="text-muted align-middle">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </Table>

            {/* ── Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-3 gap-3 fs-6">
                    <Button 
                        variant="outline-dark" 
                        size="sm"
                        onClick={() => onPageChange(1)} 
                        disabled={currentPage === 1}
                        className="px-2 py-1 pagination-btn"
                        style={{ color: "#04263D", border: "none", fontWeight: "bold" }}
                    >
                        First
                    </Button>

                    <Button 
                        variant="outline-dark" 
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="px-2 py-1 pagination-btn"
                        style={{ color: "#04263D", border: "none", fontWeight: "bold" }}
                    >
                        Previous
                    </Button>

                    <span className="fw-bold" style={{ color: "#04263D" }}>
                        {Math.min((currentPage - 1) * currentLimit + 1, totalUsers)}-{Math.min(currentPage * currentLimit, totalUsers)} 
                        <span className="ms-1">of {totalUsers}</span>
                    </span>

                    <Button 
                        variant="outline-dark" 
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 pagination-btn"
                        style={{ color: "#04263D", border: "none", fontWeight: "bold" }}
                    >
                        Next
                    </Button>

                    <Button 
                        variant="outline-dark" 
                        size="sm"
                        onClick={() => onPageChange(totalPages)} 
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 pagination-btn"
                        style={{ color: "#04263D", border: "none", fontWeight: "bold" }}
                    >
                        Last
                    </Button>
                </div>
            )}

        </>

    );
    
};

export default UsersTable;