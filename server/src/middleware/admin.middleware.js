export const adminRoute = (req, res, next) => {

    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();

};

export const superAdminRoute = (req, res, next) => {
    
    if (req.user.role !== "SuperAdmin") {
        return res.status(403).json({ message: "Access denied. Super Admins only." });
    }
    next();

};