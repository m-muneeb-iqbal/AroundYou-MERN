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

conversationSchema.index({ participants: 1 }, { unique: true, sparse: true });

conversationSchema.pre("save", function(next) {
    // Sort participants to ensure consistent ordering
    if (this.participants && this.participants.length > 1) {
        this.participants.sort((a, b) => a.toString().localeCompare(b.toString()));
    }
    next();
});

conversationSchema.pre("deleteOne", { document: true, query: false }, async function () {

    await mongoose.model("Message").deleteMany({ conversationId: this._id });

});

conversationSchema.pre("findOneAndDelete", async function () {

    const conversation = await this.model.findOne(this.getFilter());

    if (conversation) {
        await mongoose.model("Message").deleteMany({ conversationId: conversation._id });
    }

});

conversationSchema.pre("deleteMany", async function () {

    const conversations = await this.model.find(this.getFilter()).select("_id");
    const ids = conversations.map((c) => c._id);
    
    if (ids.length > 0) {
        await mongoose.model("Message").deleteMany({ conversationId: { $in: ids } });
    }

});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;