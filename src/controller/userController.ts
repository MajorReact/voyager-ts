import bcrypt from "bcryptjs";
import { Send } from "express";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/userModel";

type Req = {
  user(user: any): typeof User;
  body: {
    name: string;
    email: string;
    password: string;
  };
};

type Res = {
  status: (status: number) => Res;
  json: (body: object) => Res;
  throw: (error: Error) => Error;
  send: (send: String) => Send;
};

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = (req: Req, res: Res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields required for registration");
  }

  // Check if user exists
  User.findOne({ email })
    .then((userExists) => {
      if (userExists) {
        res.status(400);
        throw new Error("User already exists");
      }

      // Hash password
      return bcrypt.genSalt(10);
    })
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create user
      return User.create({
        name,
        email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Server error",
      });
    });
};

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = (req: Req, res: Res) => {
  const { email, password } = req.body;

  // Check for user email
  User.findOne({ email })
    .then((user) => {
      if (user && bcrypt.compare(password, user.password)) {
        res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("Invalid credentials");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Server error",
      });
    });
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req: Req, res: Res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

// Generate JWT
const generateToken = (id: string) => {
  return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export { registerUser, loginUser, getMe };
