import express from "express";
import UmurStatistikController from "../../controllers/infografis/umurStatistikController.js";

const router = express.Router();

// Public routes (read-only)
router.get("/tahun/:tahun", UmurStatistikController.getByYear);

export default router;