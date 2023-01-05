import mongoose from "mongoose";
var colors = require("colors");

const connectDB = async (): Promise<void> => {
  mongoose
    .connect(process.env?.MONGO_URI!)
    // where ! is non-null assertion operator
    .then((conn) => {
      console.log(
        colors.brightMagenta.underline(
          `MongoDB connected successfully: ${conn?.connection?.host}`
        )
      );
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    })
    .finally(() => {
      // Disconnect from database, close connections, etc.
    });
};

export default connectDB;
