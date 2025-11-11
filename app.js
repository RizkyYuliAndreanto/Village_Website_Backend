import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import listEndpoints from "express-list-endpoints";
import { logger, httpLogger } from "./config/logger.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { apiLimiter, authLimiter } from "./src/middlewares/rateLimiter.js";

// general
import authRoutes from "./src/routes/auth/auth.js";

// ppid
import dusunRoutes from "./src/routes/ppid/masyarakat/dusun.js";
import rtRoutes from "./src/routes/ppid/masyarakat/rt.js";
import masyarakatRoutes from "./src/routes/ppid/masyarakat/masyarakat.js";
import kategoriUmkmRoutes from "./src/routes/ppid/umkm/kategoriUmkm.js";
import umkmRoutes from "./src/routes/ppid/umkm/umkm.js";

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
    origin: frontendUrl, // <-- Ini harus sesuai dengan port frontend Anda
    credentials: true, // <-- Penting untuk mengizinkan cookie (untuk refresh token)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Izinkan semua metode
  })
);
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Ini akan mencatat semua permintaan yang masuk setelah ini
app.use(httpLogger);

// Rate limiting menggunakan middleware terpisah
app.use("/api/", apiLimiter);

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
// #masyarakat
app.use("/api/ppid/dusun", dusunRoutes);
app.use("/api/ppid/rt", rtRoutes);
app.use("/api/ppid/msyrkt", masyarakatRoutes);

// infografis routes
app.use("/api/infografis/demografi-penduduk", demografiPendudukRoutes);
app.use("/api/infografis/tahun-data", tahunDataRoutes);
app.use("/api/infografis/agama-statistik", agamaStatistikRoutes);
app.use("/api/infografis/umur-statistik", umurStatistikRoutes);

// #umkm
app.use("/api/ppid/kategori_umkm", kategoriUmkmRoutes);
app.use("/api/ppid/umkm", umkmRoutes);

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
