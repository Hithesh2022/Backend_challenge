import mongoose from "mongoose";
const BlacklistSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            ref: "User",
        },
    },
    { timestamps: true }
);
const blacklist = mongoose.model("blacklist", BlacklistSchema);
export default blacklist;