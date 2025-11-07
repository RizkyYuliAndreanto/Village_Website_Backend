import { db } from "../../../config/database.js";
import { generateToken, generateRefreshToken } from "../../../config/jwt.js";
import bcrypt from "bcryptjs";
import { loginSchema } from "../../validations/auth/authValidation.js";
import dotenv from "dotenv";
dotenv.config();

class AuthController {
  static async login(req, res, next) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          details: error.details.map((detail) => detail.message),
        });
      }

      const { email, password } = value;
      const user = await db("users").where({ email }).first();
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      const accessToken = generateToken({
        id: user.id,
        email: user.email,
      });
      const refreshToken = generateRefreshToken({ id: user.id });

      const REFRESH_TOKEN_LIFETIME_SECONDS = 7 * 24 * 60 * 60;
      const expiresAt = new Date(
        Date.now() + REFRESH_TOKEN_LIFETIME_SECONDS * 1000
      );

      // 1. Cek apakah token untuk user ini sudah ada
      const existingToken = await db("refresh_tokens")
        .where({ user_id: user.id })
        .first();

      if (existingToken) {
        // 2. Jika ada, UPDATE token yang ada
        await db("refresh_tokens").where({ user_id: user.id }).update({
          token: refreshToken,
          expires_at: expiresAt,
          updated_at: new Date(),
        });
      } else {
        // 3. Jika tidak ada, INSERT token baru
        await db("refresh_tokens").insert({
          user_id: user.id,
          token: refreshToken,
          expires_at: expiresAt,
        });
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email, 
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      // optional: set refresh token as httpOnly cookie
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: REFRESH_TOKEN_LIFETIME_SECONDS * 1000,
        sameSite: "lax",
      };
      res.cookie("refreshToken", refreshToken, cookieOptions);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: userData,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      // Data user sudah divalidasi dan dilampirkan oleh middleware
      const { id } = req.user;

      const user = await db("users")
        .select("id", "name", "email", "created_at", "updated_at")
        .where({ id })
        .first();
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Langsung buat access token baru
      const newAccessToken = generateToken({
        id: user.id,
        email: user.email,
      });

      res.json({
        success: true,
        message: "Access token renewed successfully",
        data: {
          user,
          accessToken: newAccessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication error: User ID not found.",
        });
      }

      // Hapus semua refresh token milik user
      await db("refresh_tokens").where({ user_id: userId }).del();

      // Hapus cookie refresh token di client jika dipakai
      res.clearCookie("refreshToken");

      res.status(200).json({
        success: true,
        message: "Successfully logged out from all devices",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await db("users")
        .select("id", "name", "email", "created_at", "updated_at")
        .where({ id: req.user.id })
        .first();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile retrieved successfully",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
