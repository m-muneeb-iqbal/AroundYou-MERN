import { PassThrough } from "stream";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -role -username -__v");
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

    const { fullName, username, email, password} = req.body;

    try {
        if (!fullName || !email || !username || !password) 
            return res.status(400).json({ message: "Please fill in all fields." });

        if (password.length < 8) 
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        
        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "Email already exists." });

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            username: username,
            email: email,
            password: hashedPassword,
        });

        if (newUser) {
            await newUser.save();

            res.status(201).json({ message: "Account created successfully" });

        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller: ", error.message);
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
            ).select("-password");

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
            ).select("-password");

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

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        let hasUpdates = false;
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
                hasUpdates = true;
            }
        });

        if (!hasUpdates) {
            return res.status(400).json({ message: "No valid fields provided to update." });
        }

        await user.save();
        res.status(200).json(user);

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
            ).select("-password");

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