import express from "express";
import TahunDataController from "../../controllers/infografis/tahunDataController.js";
import {
  createTahunDataValidation,
  updateTahunDataValidation,
  paramIdTahunValidation,
  paramTahunValueValidation,
} from "../../validations/infografis/tahunDataValidation.js";
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
router.get("/", TahunDataController.getAllTahunData);
router.get("/stats", TahunDataController.getTahunDataWithStats);
router.get("/range", TahunDataController.getYearsRange);
router.get(
  "/year/:tahun",
  validateRequest(paramTahunValueValidation, "params"),
  TahunDataController.getTahunDataByYear
);
router.get(
  "/:id",
  validateRequest(paramIdTahunValidation, "params"),
  TahunDataController.getTahunDataById
);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(createTahunDataValidation, "body"),
  TahunDataController.createTahunData
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(paramIdTahunValidation, "params"),
  validateRequest(updateTahunDataValidation, "body"),
  TahunDataController.updateTahunData
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(paramIdTahunValidation, "params"),
  TahunDataController.deleteTahunData
);

export default router;
