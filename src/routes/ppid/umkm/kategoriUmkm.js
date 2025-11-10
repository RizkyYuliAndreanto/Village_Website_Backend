import express from "express";
import KategoriUmkmController from "../../../controllers/ppid/umkm/kategoriUmkmController.js";
import { authenticate } from "../../../middlewares/auth.js";

const router = express.Router();

// gunakan authenticate (akses via access token). Jika ingin pakai refresh-token middleware ganti dengan refreshTokenMiddleware
router.use(authenticate);

// List, create, read, update, delete
router.get("/", KategoriUmkmController.index);
router.post("/", KategoriUmkmController.store);
router.get("/:id", KategoriUmkmController.show);
router.patch("/:id", KategoriUmkmController.update);
router.delete("/:id", KategoriUmkmController.destroy);

export default router;
