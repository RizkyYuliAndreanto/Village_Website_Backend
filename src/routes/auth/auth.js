import express from "express";
import AuthController from "../../controllers/auth/authController.js";
import {
  authenticate,
  refreshTokenMiddleware,
} from "../../middlewares/auth.js";
import { uploadSingle } from "../../middlewares/upload.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post(
  "/refresh-token",
  refreshTokenMiddleware,
  AuthController.refreshToken
);

router.use(authenticate);
router.get("/me", AuthController.getProfile);
router.delete("/logout", AuthController.logout); 

export default router;
