import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriends, getPendingRequests, getNonFriends } from "../controllers/friend.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/request", protectRoute, sendFriendRequest);
router.put("/accept/:requestId", protectRoute, acceptFriendRequest);
router.delete("/reject/:requestId", protectRoute, rejectFriendRequest);
router.get("/friends", protectRoute, getFriends);
router.get("/pending", protectRoute, getPendingRequests);
router.get("/non-friends", protectRoute, getNonFriends);

export default router;