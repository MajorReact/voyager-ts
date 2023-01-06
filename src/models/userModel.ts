import { Schema, model } from "mongoose";

// Doc Interface
interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  timestamps?: boolean;
}

// Schema corresponding to the doc interface.
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a Model.
const User = model<IUser>("User", userSchema);

export { User };
