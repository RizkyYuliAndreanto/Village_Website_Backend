import express from "express";
import AgamaStatistikController from "../../controllers/infografis/agamaStatistikController.js";
// (Tambahkan validasi dan auth middleware jika perlu)

const router = express.Router();

// Public routes (read-only)
// Kita gunakan 'tahun' (angka tahun) bukan 'id' (id_tahun) agar lebih mudah di frontend
router.get("/tahun/:tahun", AgamaStatistikController.getByYear);

// (Tambahkan rute admin (POST, PUT, DELETE) di sini nanti)

export default router;