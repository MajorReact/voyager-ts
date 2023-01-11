// The controller uses a route which is protected by our middleware
// Routes and middlewares are a part of the controller

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

interface LoginUserDTO {
  email: string;
  password: string;
}

interface Response {
  status: (statusCode: number) => Response;
  json: (data: any) => void;
}

interface Request {
  body: any;
  params: any;
}

export class UserController {
  static async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password }: RegisterUserDTO = req.body;

      // Check for existing user
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          error: "User already exists",
        });
      }

      // Create new user
      const newUser = new User({
        name,
        email,
        password,
      });

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      // Save the user to the database
      await newUser.save();

      // Create a jsonwebtoken
      const payload = {
        user: {
          id: newUser._id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err: any, token: any) => {
          if (err) throw err;
          res.status(201).json({
            success: true,
            token,
          });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password }: LoginUserDTO = req.body;

      // Check for existing user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Create a jsonwebtoken
      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err: any, token: any) => {
          if (err) throw err;
          res.status(200).json({
            success: true,
            token,
          });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
}
