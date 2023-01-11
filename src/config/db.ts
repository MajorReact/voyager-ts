import mongoose from "mongoose";

const connectDB = async (
  uri: string,
  options: mongoose.ConnectOptions = {}
): Promise<void> => {
  await mongoose.connect(uri, {
    ...options,
  });
  console.log("MongoDB Connected...");
};

const closeConnection = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log("MongoDB Disconnected...");
};

export { connectDB, closeConnection };

// import mongoose from "mongoose";
// var colors = require("colors");
//
// const connectDB = async (): Promise<void> => {
//   mongoose
//     .connect(process.env?.MONGO_URI!)
//     // where ! is non-null assertion operator
//     .then((conn) => {
//       console.log(
//         colors.brightMagenta.underline(
//           `MongoDB connected successfully: ${conn?.connection?.host}`
//         )
//       );
//     })
//     .catch((error) => {
//       console.log(error);
//       process.exit(1);
//     })
//     .finally(() => {
//       // Disconnect from database, close connections, etc.
//     });
// };
//
// export default connectDB;
