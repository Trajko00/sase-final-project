import dotenv from "dotenv";
import { createServer } from "./lib/createServer";
import { connectDB } from "./lib/db";
dotenv.config();
const port = process.env.PORT || 3000;
const app = createServer();

app.listen(port, () => {
  dotenv.config();
  connectDB();
  console.log("Server started at ", port);
});
