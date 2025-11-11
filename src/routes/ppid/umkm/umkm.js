import express from "express";
import UmkmController from "../../../controllers/ppid/umkm/umkmController.js";
import { authenticate } from "../../../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", UmkmController.index);
router.post("/", UmkmController.store);
router.get("/:id", UmkmController.show);
router.patch("/:id", UmkmController.update);
router.delete("/:id", UmkmController.destroy);

export default router;
