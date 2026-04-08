import { 
    checkAuth, signup, verifyEmail, resendVerification, login, logout, 
    getProfile, updateProfilePicture, updatePersonalInformation, updateEducation, 
    updateExperience, updateSkills, deleteEducation, deleteCertification, deleteExperience,
    forgotPassword, resetPassword, changePassword
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import passport from "passport";
import express from "express";
import multer from "multer";

import { generateToken } from "../lib/utils.js";

const router = express.Router();
const  upload = multer ({ storage: multer.memoryStorage() });

router.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);
router.get("/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        generateToken(req.user._id, res);
        res.redirect(`${process.env.CLIENT_URL}/`);
    }
);
router.post("/signup",                                                  signup);
router.get("/verify-email",                                             verifyEmail);
router.post("/resend-verification",                                     resendVerification);
router.post("/login",                                                   login);
router.post("/logout",                                                  logout);
router.get("/check",                                                    protectRoute, checkAuth);

router.get("/profile",                                                  protectRoute, getProfile);
router.patch("/update-profile-picture", upload.single("profilePic"),    protectRoute, updateProfilePicture)
router.put("/update-personal-info",                                     protectRoute,  updatePersonalInformation);
router.put("/update-education",                                         protectRoute,  updateEducation);
router.delete("/delete-education",                                      protectRoute, deleteEducation);
router.delete("/delete-certification",                                  protectRoute, deleteCertification);
router.put("/update-experience",                                        protectRoute,  updateExperience);
router.delete("/delete-experience",                                     protectRoute, deleteExperience);
router.put("/update-skills",                                            protectRoute,  updateSkills);
router.post("/forgot-password",                                         forgotPassword);
router.post("/reset-password",                                          resetPassword);
router.put("/change-password",                                          protectRoute, changePassword);

export default router;