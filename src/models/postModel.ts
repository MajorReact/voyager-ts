import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "Please add a post"],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("User", postSchema);

export default Post;
