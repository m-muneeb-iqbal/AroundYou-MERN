import { PassThrough } from "stream";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/user.model.js";

import { generateToken } from "../lib/utils.js";
import { sendVerificationEmail } from "../lib/email.js";
import cloudinary from "../lib/cloudinary.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -role -verificationToken -verificationTokenExpiry -__v");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user.toSafeObject());
    } catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signup = async (req, res) => {

    const { fullName, username, email, password } = req.body;

    try {

        if (!fullName || !email || !username || !password)
            return res.status(400).json({ message: "Please fill in all fields." });

        if (password.length < 8)
            return res.status(400).json({ message: "Password must be at least 8 characters." });

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            if (!existingUser.isVerified) {

                const token = crypto.randomBytes(32).toString("hex");
                const expiry = new Date(Date.now() + 15 * 60 * 1000);

                existingUser.verificationToken = token;
                existingUser.verificationTokenExpiry = expiry;
                await existingUser.save();

                try {
                    await sendVerificationEmail({ to: email, fullName: existingUser.fullName, token });
                } catch (emailErr) {
                    console.error("Failed to resend verification email:", emailErr.message);
                }

                return res.status(200).json({
                    message: "Account exists but is unverified. A new verification email has been sent.",
                    unverified: true,
                });

            }
            return res.status(400).json({ message: "Email already exists." });

        }

        const existingUsername = await User.findOne({ username });

        if (existingUsername)
            return res.status(400).json({ message: "Username already taken." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken: token,
            verificationTokenExpiry: expiry,
        });

        await newUser.save();

        try {
            await sendVerificationEmail({ to: email, fullName, token });
        } catch (emailErr) {
            console.error("Failed to send verification email:", emailErr.message);
        }

        res.status(201).json({
            message: "Account created. Please check your email to verify your account.",
        });

    } catch (error) {
        console.error("Error in signup:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

export const verifyEmail = async (req, res) => {

    const { token } = req.query;

    try {

        if (!token)
            return res.status(400).json({ message: "Verification token is required." });

        const user = await User.findOne({ verificationToken: token });

        if (!user)
            return res.status(400).json({ message: "Invalid verification link." });

        if (user.verificationTokenExpiry < new Date())
            return res.status(400).json({ message: "Verification link has expired. Please request a new one." });

        // Activate account and clear token
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await user.save();

        // Auto login — issue JWT
        generateToken(user._id, res);

        res.status(200).json({
            message: "Email verified successfully.",
            user: user.toSafeObject(),
        });

    } catch (error) {
        console.error("Error in verifyEmail:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

// ── RESEND VERIFICATION EMAIL
export const resendVerification = async (req, res) => {
    
    const { email } = req.body;

    try {

        if (!email)
            return res.status(400).json({ message: "Email is required." });

        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ message: "No account found with this email." });

        if (user.isVerified)
            return res.status(400).json({ message: "This account is already verified." });

        // Issue fresh token
        const token = crypto.randomBytes(32).toString("hex");
        user.verificationToken = token;
        user.verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        await sendVerificationEmail({ to: email, fullName: user.fullName, token });

        res.status(200).json({ message: "Verification email resent." });

    } catch (error) {
        console.error("Error in resendVerification:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
};

export const login = async (req, res) => {

    console.log("Login route hit");
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified)
            return res.status(403).json({ message: "Please verify your email before logging in.", unverified: true });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Password mismatch");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(201).json({ message: "Logged in successfully" });

    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {

    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//UPDATE
export const updateProfilePicture = async (req, res) => {

    try {

        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const bufferStream = new PassThrough();
        bufferStream.end(req.file.buffer);

        cloudinary.uploader.upload_stream(

            { folder: "profiles" },
            async (error, uploaded) => {

                if (error) return res.status(500).json({ message: error.message });

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { profilePic: uploaded.secure_url },
                    { new: true }
                );

                res.status(200).json(updatedUser);
            }
        ).end(req.file.buffer);

    } catch (err) {
        console.error("Error updating profile picture:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updatePersonalInformation = async (req, res) => {

    try {

        const userId = req.user._id;
        const allowedFields = [
            
            "description",
            "fullName",
            "email",
            "dob",
            "phoneNumber",
            "age",
            "location",
            "designation",
            "website",
        ];
        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided to update." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true,          // return updated document
                runValidators: true // run schema validators
            }
            ).select("-password -role -verificationToken -verificationTokenExpiry");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("updatePersonalInformation:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateEducation = async (req, res) => {

    try {

        const userId = req.user._id;
        const allowedFields = [
            
            "education",
            "field",
            "passingYear",
            "cgpa",
            "institute",
            "certificate",
            "provider",
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided to update." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true,          // return updated document
                runValidators: true // run schema validators
            }
            ).select("-password -role -verificationToken -verificationTokenExpiry");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateEducation:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateExperience = async (req, res) => {

    try {

        const userId = req.user._id;
        const allowedFields = [
            
            "company",
            "jobTitle",
            "joiningDate",
            "resignationDate",
            "currentlyWorking"
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided to update." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select("-password -role -verificationToken -verificationTokenExpiry");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error in updateExperience:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateSkills = async (req, res) => {

    try {

        const userId = req.user._id;
        const allowedFields = [
            
            "skills"
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided to update." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true,          // return updated document
                runValidators: true // run schema validators
            }
            ).select("-password -role -verificationToken -verificationTokenExpiry");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error in updateSkills:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//DELETE
export const deleteEducation = async (req, res) => {

    try {

        const userId = req.user._id;
        const user = await User.findByIdAndUpdate(

        userId,
        {
            $unset: {
                education: "",
                field: "",
                passingYear: "",
                cgpa: "",
                institute: ""
            }
        },
        { new: true });

        res.status(200).json({
            message: "Education removed successfully",
            user
        });

    } catch (error) {
        console.error("Delete education error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteCertification = async (req, res) => {

    try {

        const userId = req.user._id;
        const user = await User.findByIdAndUpdate(

        userId,
        {
            $unset: {
                certificate: "",
                provider: ""
            }
        },
        { new: true });

        res.status(200).json({
            message: "Certification removed successfully",
            user
        });

    } catch (error) {
        console.error("Delete certification error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteExperience = async (req, res) => {

    try {

        const userId = req.user._id;
        const user = await User.findByIdAndUpdate(

        userId,
        {
            $unset: {
                company: "",
                jobTitle: "",
                joiningDate: "",
                resignationDate: "",
                currentlyWorking: false
            }
        },
        { new: true });

        res.status(200).json({
            message: "Experience removed successfully",
            user
        });

    } catch (error) {
        console.error("Delete experience error:", error);
        res.status(500).json({ message: "Server error" });
    }
};