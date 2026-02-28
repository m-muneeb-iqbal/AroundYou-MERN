// routes/user.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRandomUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/random", protectRoute, getRandomUsers);

export default router;