import { useState, useRef, useEffect } from "react";

export const useAdminFilters = (fetchUsers) => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [location, setLocation] = useState("");
    const [sortBy, setSortBy] = useState("fullName");
    const [sortOrder, setSortOrder] = useState("asc");
    const [limit, setLimit] = useState(10);
    const debounceRef = useRef(null);

    // Debounce filter/sort changes
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchUsers({ q: search, role: roleFilter, location, sortBy, sortOrder, page: 1, limit });
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [search, roleFilter, location, sortBy, sortOrder, limit, fetchUsers]);

    const handleSortChange = (field, order) => {
        setSortBy(field);
        setSortOrder(order);
    };

    const handlePageChange = (page) => {
        fetchUsers({ q: search, role: roleFilter, location, sortBy, sortOrder, page, limit });
    };

    return {
        search, setSearch,
        roleFilter, setRoleFilter,
        location, setLocation,
        sortBy, sortOrder, handleSortChange,
        limit, setLimit,
        handlePageChange,
    };
};