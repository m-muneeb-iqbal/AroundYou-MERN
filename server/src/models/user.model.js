import mongoose from "mongoose";

const userSchema = new mongoose.Schema (

    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true,
            minlength: 6
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            enum: ["Admin", "Student", "Alumni"],
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        profilePic: {
            type: String,
            default: ""
        }
    },
    {timestamps: true}

);

const User = mongoose.model("User", userSchema);
export default User;