import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { PassThrough } from "stream";

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