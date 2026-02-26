import mongoose from "mongoose";

const userSchema = new mongoose.Schema (

    {
        //Personal Info
        fullName: {
            type: String,
            required: true,
            minlength: 6
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        dob: {
            type: Date,
        },
        phoneNumber: {
            type: String,
            default: "",
            match: [/^\d{11}$/]
        },
        age: {
            type: Number,
            default: 18,
        },
        location: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },

        //Education
        education: {
            type: String,
            enum: ["Matriculation/O-Level", "Intermediate/A-Level", "DAE", "Bachelors", "Masters", "PHD/Doctorate", "ACCA", "CA", "CMA"],
            default: "Matriculation/O-Level",
        },

        field: {
            type: String,
            default: "",
        },
        passingYear: {
            type: Number,
            default: 1900,
            validate: {
                validator: function (value) {
                    const currentYear = new Date().getFullYear();
                    return (
                        Number.isInteger (value) && value >= 1900 && value <= currentYear + 4
                    );
                },
            },
        },
        cgpa: {
            type: Number,
            min: 0.0,
            max: 4.0,
            default: 0.0,
            validate: {
                validator: function (value) {
                    return Number.isFinite(value) && /^\d(\.\d{1,2})?$/.test(value.toString());
                },
            }
        },
        institute: {
            type: String,
            default: "",
        },
        certificate: {
            type: String,
            default: "",
        },
        provider: {
            type: String,
            default: "",
        },

        //Experience
        company: {
            type: String,
            default: "",
        },
        jobTitle: {
            type: String,
            default: "",
        },
        joiningDate: {
            type: Date,
        },
        resignationDate: {
            type: Date,
        },

        //Skills
        skills: {
            type: [String],
            default: [],
            validate: {
                validator: function(arr) {
                    return arr.every(skill => typeof skill === "string" && skill.trim().length > 0);
                },
            }
        },

        username: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            enum: ["Admin", "User"],
            default: "User"
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        profilePic: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: "",
            maxlength: 300,
        },
    },
    {timestamps: true}

);

const User = mongoose.model("User", userSchema);
export default User;