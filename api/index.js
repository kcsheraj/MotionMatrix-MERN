import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import routineRoutes from "./routes/routine.route.js"; // Import routine routes
import calendarRoutes from "./routes/calendar.route.js"; // Import the new calendar routes
import prRoutes from "./routes/pr.route.js"; // Import PR routes
import weightRoutes from "./routes/weight.route.js";
import picRoutes from "./routes/pic.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Register the routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/routine", routineRoutes); // Use routine routes
app.use("/api/calendar", calendarRoutes); // Use the new calendar routes
app.use("/api/pr", prRoutes); // Use PR routes
app.use("/api/weight", weightRoutes);
app.use("/api/pics", picRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
