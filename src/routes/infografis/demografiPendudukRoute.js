import express from "express";
import DemografiPendudukController from "../../controllers/infografis/demografiPendudukController.js";
import {
  createDemografiPendudukValidation,
  updateDemografiPendudukValidation,
  paramIdValidation,
  paramTahunValidation,
} from "../../validations/infografis/demografisPendudukValidation.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/roleHandler.js";

const router = express.Router();

// Middleware untuk validasi request
const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessage,
      });
    }

    req[property] = value;
    next();
  };
};

// Public routes (read-only)
router.get("/", DemografiPendudukController.getAllDemografiPenduduk);
router.get("/stats", DemografiPendudukController.getDemografiPendudukStats);
router.get(
  "/year/:tahun",
  validateRequest(paramTahunValidation, "params"),
  DemografiPendudukController.getDemografiPendudukByYear
);
router.get(
  "/:id",
  validateRequest(paramIdValidation, "params"),
  DemografiPendudukController.getDemografiPendudukById
);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(createDemografiPendudukValidation, "body"),
  DemografiPendudukController.createDemografiPenduduk
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(paramIdValidation, "params"),
  validateRequest(updateDemografiPendudukValidation, "body"),
  DemografiPendudukController.updateDemografiPenduduk
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(paramIdValidation, "params"),
  DemografiPendudukController.deleteDemografiPenduduk
);

export default router;
