// The controller uses a route which is protected by our middleware
// Routes and middlewares are a part of the controller
import Post from "../models/postModel";
import User from "../models/userModel";

interface CreatePostDTO {
  userId: string;
  text: string;
}

interface UpdatePostDTO {
  text?: string;
}

interface Response {
  status: (statusCode: number) => Response;
  json: (data: any) => void;
}

interface Request {
  body: any;
  params: any;
  user: any;
}

class PostController {
  static async createPost(req: Request, res: Response) {
    try {
      const user = await User.findById(req.body.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not found",
        });
      }

      const postData: CreatePostDTO = {
        userId: user._id,
        text: req.body.text,
      };

      const post = await Post.create(postData);
      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }

  static async getPosts(req: Request, res: Response) {
    try {
      const posts = await Post.find({}).populate("user", "-password");
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }

  static async getPost(req: Request, res: Response) {
    try {
      // When we populate a field, it returns the entire document.
      // We want to exempt the password.
      const post = await Post.findById(req.params.id).populate(
        "user",
        "-password"
      );
      if (!post) {
        return res.status(404).json({
          success: false,
          error: "Post not found",
        });
      }
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }

  static async updatePost(req: Request, res: Response) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          success: false,
          error: "Post not found",
        });
      }

      if (req.user._id.toString() !== post.user.toString()) {
        return res.status(401).json({
          success: false,
          error: "User not authorized",
        });
      }

      const postData: UpdatePostDTO = {
        text: req.body.text,
      };

      post.set(postData);
      await post.save();

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          success: false,
          error: "Post not found",
        });
      }

      if (req.user._id.toString() !== post.user.toString()) {
        return res.status(401).json({
          success: false,
          error: "User not authorized",
        });
      }

      await post.remove();

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
}

export default PostController;
