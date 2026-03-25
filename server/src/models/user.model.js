import mongoose from "mongoose";

const userSchema = new mongoose.Schema (

    {

        googleId: { 
            type: String, 
            default: null 
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        },
        authProvider: { 
            type: String, 
            enum: ["local", "google"], 
            default: "local" 
        },
        verificationToken: { 
            type: String, 
            default: null 
        },
        verificationTokenExpiry: { 
            type: Date, 
            default: null 
        },

        //Personal Info
        profilePic: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: "",
            maxlength: 300,
        },
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
        },
        location: {
            type: String,
            default: "",
        },
        designation: {
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
        },

        field: {
            type: String,
            default: "",
        },
        passingYear: {
            type: Number,
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
            set: v => v === "" ? null : v,
            validate: {
            validator: function(value) {
                if (this.currentlyWorking) {
                    return value === null || value === undefined;
                } else {
                    return value instanceof Date || !isNaN(value);
                }
            }
        }
        },
        currentlyWorking: {
            type: Boolean,
            default: false
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
            enum: ["SuperAdmin", "Admin", "User"],
            default: "User"
        },
        password: {
            type: String,
            minlength: 8,
            required: function() { 
                return this.authProvider === "local"; 
            }
        },
        resetPasswordToken: { 
            type: String, 
            default: null 
        },
        resetPasswordTokenExpiry: { 
            type: Date, 
            default: null 
        },
    },

    {timestamps: true},

);

userSchema.methods.toSafeObject = function () {
    return {
        _id: this._id,
        profilePic: this.profilePic,
        description: this.description,
        fullName: this.fullName,
        company: this.company,
        designation: this.designation,
        location: this.location,
        jobTitle: this.jobTitle,
        isAdmin: this.role === "Admin" || this.role === "SuperAdmin",
        isSuperAdmin: this.role === "SuperAdmin",
    };
}

userSchema.methods.toProfileData = function () {
    return {
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
        profilePic: this.profilePic,
        description: this.description,
        location: this.location,
        designation: this.designation,
        website: this.website,
        dob: this.dob,
        phoneNumber: this.phoneNumber,
        age: this.age,
        education: this.education,
        field: this.field,
        passingYear: this.passingYear,
        cgpa: this.cgpa,
        institute: this.institute,
        certificate: this.certificate,
        provider: this.provider,
        company: this.company,
        jobTitle: this.jobTitle,
        joiningDate: this.joiningDate,
        resignationDate: this.resignationDate,
        currentlyWorking: this.currentlyWorking,
        skills: this.skills,
        isAdmin: this.role === "Admin" || this.role === "SuperAdmin",
        isSuperAdmin: this.role === "SuperAdmin",
    };
}

userSchema.methods.toPublicObject = function () {
    return {
        _id: this._id,
        fullName: this.fullName,
        profilePic: this.profilePic,
    };
};

const User = mongoose.model("User", userSchema);
export default User;