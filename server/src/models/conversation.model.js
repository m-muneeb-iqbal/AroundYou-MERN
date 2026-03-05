import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },

        unreadCounts: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                count: {
                    type: Number,
                    default: 0,
                    min: 0,
                },
            }
        ],
    },

    { timestamps: true }

);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ participants: 1 }, { unique: true, sparse: true });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;