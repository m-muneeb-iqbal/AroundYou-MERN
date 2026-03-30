import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["request_received", "request_accepted"],
            required: true,
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// MongoDB auto-deletes documents older than 7 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export default mongoose.model("Notification", notificationSchema);