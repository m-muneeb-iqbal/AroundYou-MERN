import { checkAuth, login, logout, signup, updateProfilePicture, updatePersonalInformation, updateEducation, deleteEducation, deleteCertification, updateExperience, updateSkills } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const  upload = multer ({ storage: multer.memoryStorage() });

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.patch("/update-profile-picture", upload.single("profilePic"), protectRoute, updateProfilePicture)

router.put("/update-personal-info", protectRoute,  updatePersonalInformation);

router.put("/update-education", protectRoute,  updateEducation);

router.delete("/delete-education", protectRoute, deleteEducation);

router.delete("/delete-certification", protectRoute, deleteCertification);

router.put("/update-experience", protectRoute,  updateExperience);

router.put("/update-skills", protectRoute,  updateSkills);

router.get("/check", protectRoute, checkAuth);

export default router;