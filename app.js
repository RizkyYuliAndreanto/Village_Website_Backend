import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import listEndpoints from "express-list-endpoints";
import { logger, httpLogger } from "./config/logger.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import router from "./src/routes/index.js";

// general
import authRoutes from "./src/routes/auth/auth.js";

// ppid
import dusunRoutes from "./src/routes/ppid/dusun.js";
import rtRoutes from "./src/routes/ppid/rt.js";
import masyarakatRoutes from "./src/routes/ppid/masyarakat.js";

// infografis
import demografiPendudukRoutes from "./src/routes/infografis/demografiPendudukRoute.js";
import tahunDataRoutes from "./src/routes/infografis/tahunDataRoute.js";
import agamaStatistikRoutes from "./src/routes/infografis/agamaStatistikRoute.js";
import umurStatistikRoutes from "./src/routes/infografis/umurStatistikRoute.js";

const app = express();
const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:5173";
const PORT = process.env.PORT || 300;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: frontendUrl,   // <-- Ini harus sesuai dengan port frontend Anda
    credentials: true,     // <-- Penting untuk mengizinkan cookie (untuk refresh token)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] // Izinkan semua metode
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

// infografis routes
app.use("/api/infografis/demografi-penduduk", demografiPendudukRoutes);
app.use("/api/infografis/tahun-data", tahunDataRoutes);
app.use("/api/infografis/agama-statistik", agamaStatistikRoutes);
app.use("/api/infografis/umur-statistik", umurStatistikRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Error handling middleware
app.use(errorHandler);

console.table(listEndpoints(app)); // tampil rapi seperti artisan route:list
// Start server
app.listen(PORT, () => {
  // 3. (Opsional) Gunakan logger untuk pesan status server
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
