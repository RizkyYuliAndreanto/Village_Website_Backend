import express from "express";
import DusunController from "../../../controllers/ppid/masyarakat/dusunController.js";
import { authorizeRole } from "../../../middlewares/roleHandler.js";
import { authenticate } from "../../../middlewares/auth.js";

const router = express.Router();
router.use(authenticate);
router.use(authorizeRole("admin"));

// List all dusuns
router.get("/", DusunController.index);

// Create new dusun
router.post("/", DusunController.store);

// Get single dusun
router.get("/:id", DusunController.show);

// Update dusun (partial)
router.patch("/:id", DusunController.update);

// Delete dusun
router.delete("/:id", DusunController.destroy);

export default router;
