// src/routes/index.js
import express from "express";

// Auth
import authRoutes from "./auth/auth.js";

// PPID
import dusunRoutes from "./ppid/dusun.js";
import rtRoutes from "./ppid/rt.js";
import masyarakatRoutes from "./ppid/masyarakat.js";

// Infografis
import demografiPendudukRoutes from "./infografis/demografiPendudukRoute.js";
import tahunDataRoutes from "./infografis/tahunDataRoute.js";

const router = express.Router();

// Auth
router.use("/auth", authRoutes);

// PPID
router.use("/ppid/dusun", dusunRoutes);
router.use("/ppid/rt", rtRoutes);
router.use("/ppid/msyrkt", masyarakatRoutes);

// Infografis
router.use("/infografis/demografi-penduduk", demografiPendudukRoutes);
router.use("/infografis/tahun-data", tahunDataRoutes);

export default router;
