import { checkAuth, login, logout, signup, updateProfilePicture, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const  upload = multer ({ storage: multer.memoryStorage() });

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.patch("/update-profile-picture", upload.single("profilePic"), protectRoute, updateProfilePicture)

router.put("/update-profile", protectRoute,  updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;