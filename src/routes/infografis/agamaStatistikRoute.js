import express from "express";
import AgamaStatistikController from "../../controllers/infografis/AgamaStatistikControler.js";
import {
  createAgamaStatistikValidation,
  updateAgamaStatistikValidation,
  paramIdValidation,
  paramTahunValidation,
} from "../../validations/infografis/agamaStatistikValidation.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/roleHandler.js";
import { validateRequest } from "../../middlewares/validation.js";

const router = express.Router();

// Public routes (read-only)
router.get("/", AgamaStatistikController.getAllAgamaStatistik);
router.get("/stats", AgamaStatistikController.getAgamaStatistikStats);
router.get(
  "/year/:tahun",
  validateRequest(paramTahunValidation, "params"),
  AgamaStatistikController.getAgamaStatistikByYear
);
router.get(
  "/:id",
  validateRequest(paramIdValidation, "params"),
  AgamaStatistikController.getAgamaStatistikById
);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(createAgamaStatistikValidation, "body"),
  AgamaStatistikController.createAgamaStatistik
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(paramIdValidation, "params"),
  validateRequest(updateAgamaStatistikValidation, "body"),
  AgamaStatistikController.updateAgamaStatistik
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(paramIdValidation, "params"),
  AgamaStatistikController.deleteAgamaStatistik
);

export default router;