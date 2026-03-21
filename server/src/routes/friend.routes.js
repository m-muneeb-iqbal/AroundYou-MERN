import { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, rejectFriendRequest, unfriend, getFriends, getPendingRequests, getNonFriends } from "../controllers/friend.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/request",                 protectRoute, sendFriendRequest);
router.delete("/cancel/:requestId",     protectRoute, cancelFriendRequest);
router.put("/accept/:requestId",        protectRoute, acceptFriendRequest);
router.delete("/reject/:requestId",     protectRoute, rejectFriendRequest);
router.delete("/unfriend/:friendId",    protectRoute, unfriend);
router.get("/friends",                  protectRoute, getFriends);
router.get("/pending",                  protectRoute, getPendingRequests);
router.get("/non-friends",              protectRoute, getNonFriends);

export default router;