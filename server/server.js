import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import root from "./routes/root.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(logger.logger);
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", root);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);
app.use("/models", modelRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

await mongoose.connect(process.env.DATABASE_URI).then(() => {
  console.log("Connected to database");
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(error);
  logger.logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
