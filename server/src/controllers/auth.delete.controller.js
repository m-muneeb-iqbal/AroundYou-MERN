import User from "../models/user.model.js";

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
        { new: true }
        );

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
        { new: true }
        );

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
        { new: true }
        );

        res.status(200).json({
            message: "Experience removed successfully",
            user
        });

    } catch (error) {
        console.error("Delete experience error:", error);
        res.status(500).json({ message: "Server error" });
    }
};