import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { logger, httpLogger } from "./config/logger.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";


// general
import authRoutes from "./src/routes/auth/auth.js";

// ppid
import dusunRoutes from "./src/routes/ppid/dusun.js";
import rtRoutes from "./src/routes/ppid/rt.js";
import masyarakatRoutes from "./src/routes/ppid/masyarakat.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Ini akan mencatat semua permintaan yang masuk setelah ini
app.use(httpLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
});
app.use("/api/", limiter);

// Auth rate limiting (more strict)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Naikkan sedikit untuk mengakomodasi percobaan login
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);

// ppid routes
app.use("/api/ppid/dusun", dusunRoutes);
app.use("/api/ppid/rt", rtRoutes);
app.use("/api/ppid/msyrkt", masyarakatRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  // 3. (Opsional) Gunakan logger untuk pesan status server
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
