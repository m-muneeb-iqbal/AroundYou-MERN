import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminRoute } from "../middleware/admin.middleware.js";
import {
    getAllUsers,
    deleteUser,
    getStats,
    getAllFriendRequests,
    deleteFriendRequest,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require both protectRoute + adminRoute
router.use(protectRoute, adminRoute);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);
router.get("/friend-requests", getAllFriendRequests);
router.delete("/friend-requests/:requestId", deleteFriendRequest);

export default router;