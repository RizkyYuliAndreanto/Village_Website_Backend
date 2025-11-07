import express from "express";
import RtController from "../../controllers/ppid/rtController.js";
import { authorizeRole } from "../../middlewares/roleHandler.js";
import { authenticate } from "../../middlewares/auth.js";

const router = express.Router();
router.use(authenticate);
router.use(authorizeRole("admin"));

router.get("/", RtController.index);
router.post("/", RtController.store);
router.get("/:id", RtController.show);
router.patch("/:id", RtController.update);
router.delete("/:id", RtController.destroy);

export default router;
