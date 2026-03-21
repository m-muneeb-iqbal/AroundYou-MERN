import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminRoute, superAdminRoute } from "../middleware/admin.middleware.js";
import {
    getAllUsers, getUserById, updateUser,
    deleteUser, removeProfilePic,
    clearEducation, clearExperience, clearSkills, clearFriends,
    getStats, getAllFriendRequests, deleteFriendRequest,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin and SuperAdmin
router.get("/stats",                            protectRoute, adminRoute, getStats);
router.get("/users",                            protectRoute, adminRoute, getAllUsers);
router.get("/users/:userId",                    protectRoute, adminRoute, getUserById);
router.patch("/users/:userId",                  protectRoute, adminRoute, updateUser);
router.delete("/users/:userId/profile-pic",     protectRoute, adminRoute, removeProfilePic);
router.delete("/users/:userId/education",       protectRoute, adminRoute, clearEducation);
router.delete("/users/:userId/experience",      protectRoute, adminRoute, clearExperience);
router.delete("/users/:userId/skills",          protectRoute, adminRoute, clearSkills);
router.get("/friend-requests",                  protectRoute, adminRoute, getAllFriendRequests);
router.delete("/friend-requests/:requestId",    protectRoute, adminRoute, deleteFriendRequest);

// SuperAdmin only
router.delete("/users/:userId",                 protectRoute, superAdminRoute, deleteUser);
router.delete("/users/:userId/friends",         protectRoute, superAdminRoute, clearFriends);

export default router;