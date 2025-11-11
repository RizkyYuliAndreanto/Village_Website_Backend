import express from "express";
import UmurStatistikController from "../../controllers/infografis/UmurStatistikConteroller.js";
import {
  createUmurStatistikValidation,
  updateUmurStatistikValidation,
  paramIdValidation,
  paramTahunValidation,
  paramCompareTahunValidation,
} from "../../validations/infografis/umurStatistikValidation.js";
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
router.get("/", UmurStatistikController.getAllUmurStatistik);
router.get("/stats", UmurStatistikController.getUmurStatistikStats);
router.get(
  "/year/:tahun",
  validateRequest(paramTahunValidation, "params"),
  UmurStatistikController.getUmurStatistikByYear
);
router.get(
  "/year/:tahun/age-groups",
  validateRequest(paramTahunValidation, "params"),
  UmurStatistikController.getAgeGroupsByYear
);
router.get(
  "/year/:tahun/distribution",
  validateRequest(paramTahunValidation, "params"),
  UmurStatistikController.getAgeDistributionByYear
);
router.get(
  "/compare/:tahun1/:tahun2",
  validateRequest(paramCompareTahunValidation, "params"),
  UmurStatistikController.compareAgeGroupsByYears
);
router.get(
  "/:id",
  validateRequest(paramIdValidation, "params"),
  UmurStatistikController.getUmurStatistikById
);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(createUmurStatistikValidation, "body"),
  UmurStatistikController.createUmurStatistik
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(paramIdValidation, "params"),
  validateRequest(updateUmurStatistikValidation, "body"),
  UmurStatistikController.updateUmurStatistik
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(["admin"]),
  validateRequest(paramIdValidation, "params"),
  UmurStatistikController.deleteUmurStatistik
);

export default router;