import express from "express";
import MasyarakatController from "../../controllers/ppid/masyarakatController.js";
import { authenticate } from "../../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

// List / search / paginate
router.get("/", MasyarakatController.index);

// Create
router.post("/", MasyarakatController.store);

// Get
router.get("/:id", MasyarakatController.show);

// Update
router.patch("/:id", MasyarakatController.update);

// Delete
router.delete("/:id", MasyarakatController.destroy);

export default router;
