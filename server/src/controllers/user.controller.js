import User from "../models/user.model.js";

export const getRandomUsers = async (req, res) => {

    try {
        
        const currentUserId = req.user._id; // assuming protectRoute middleware

        const users = await User.aggregate([

            { $match: { _id: { $ne: currentUserId } } }, // exclude logged-in user
            { $sample: { size: 3 } }, // pick 3 random users
            { $project: { fullName: 1, jobTitle: 1 } } // only needed fields

        ]);

    res.status(200).json(users);

  } catch (error) {
        res.status(500).json({ message: error.message });
  }

};