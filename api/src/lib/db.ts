import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("Nema stringa za konekciju sa mongodb, proveri .env");
  }

  await mongoose.connect(process.env.MONGODB_URL).catch((err) => {
    console.log(`Neuspesno povezivanje sa mongodb! Error: ${err}`);
    process.exit(1);
  });
  mongoose.connection.on("error", (err) => {
    // console.log(err);
    console.log("exited inside mongo connection");

    process.exit(1);
  });
  process.on("SIGINT", () => {
    mongoose.connection.close(true);
  });
};
