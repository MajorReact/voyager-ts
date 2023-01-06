const Post = require("../models/postModel");
const User = require("../models/userModel");
import { Request, Response } from "express";

interface getPostRequest extends Request {
  user: getPostRequest;
  id: String;
}

interface setPostRequest extends Request {
  user: setPostRequest;
  id: String;
  body: {
    text: string;
  };
}

interface UpdatePostRequest extends Request {
  user: any;
}

interface deletePostRequest extends Request {
  user: any;
}

// @desc    Get posts
// @route   GET /api/posts
// @access  Private
const getPosts = (req: getPostRequest, res: Response) => {
  const userId = req.user?.id;
  // fron above line, do not access user property of req if not available
  Post.find({ user: userId })
    .then((posts: String) => res.status(200).json(posts))
    .catch((error: Error) => {
      console.error(error);
      res.status(500).json({
        error: "Server error",
      });
    });
};

// @desc    Set post
// @route   POST /api/posts
// @access  Private
const setPost = (req: setPostRequest, res: Response) => {
  try {
    const text = req.body?.text;
    if (!text) {
      res.status(400);
      throw new Error("Please include a Post in the text field!!!");
    }

    Post.create({
      text,
      user: req.user?.id,
    }).then((post: String) => {
      res.status(200).json(post);
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = (req: UpdatePostRequest, res: Response) => {
  Post.findById(req?.params?.id)
    .then((post) => {
      if (!post) {
        res?.status(400);
        throw new Error("Post not found");
      }

      // Check for user?
      if (!req?.user) {
        res?.status(401);
        throw new Error("User not found");
      }

      // Make sure the logged in user? matches the post user?
      if (post.user?.toString() !== req?.user?.id) {
        res?.status(401);
        throw new Error("User not authorized");
      }

      return Post.findByIdAndUpdate(req?.params?.id, req?.body, {
        new: true,
      });
    })
    .then((updatedPost) => {
      res?.status(200).json(updatedPost);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Server error",
      });
    });
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = (req: deletePostRequest, res: Response) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(400);
        throw new Error("Post not found");
      }

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      if (post.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
      }

      return post.remove();
    })
    .then(() => res.status(200).json({ id: req.params.id }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Server error",
      });
    });
};

module.exports = {
  getPosts,
  setPost,
  updatePost,
  deletePost,
};
