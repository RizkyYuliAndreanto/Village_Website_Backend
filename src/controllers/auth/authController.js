import { db } from "../../../config/database.js";
import { generateToken, generateRefreshToken } from "../../../config/jwt.js";
import bcrypt from "bcryptjs";
import { loginSchema } from "../../validations/auth/authValidation.js";
import jwt from "jsonwebtoken";
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
      const ACCESS_TOKEN_LIFETIME_SECONDS = 15 * 60; // 15 menit
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

      // Cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      };

      // Set access token cookie (expire 15 menit)
      res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_LIFETIME_SECONDS * 1000,
      });

      // Set refresh token cookie (expire 7 hari)
      res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_LIFETIME_SECONDS * 1000,
      });

      // Response tanpa token (sudah di cookie)
      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: userData,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      // Ambil refresh token dari cookie atau body
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token required",
        });
      }

      // Verify JWT refresh token
      let payload;
      try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      // PENTING: Cek apakah refresh token ada di DB dan belum expired
      const storedToken = await db("refresh_tokens")
        .where({
          user_id: payload.id,
          token: refreshToken,
        })
        .where("expires_at", ">", new Date())
        .first();

      if (!storedToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token not found or expired in database",
        });
      }

      const user = await db("users")
        .select("id", "name", "email", "created_at", "updated_at")
        .where({ id: payload.id })
        .first();

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Buat access token baru
      const newAccessToken = generateToken({
        id: user.id,
        email: user.email,
      });

      // Set access token baru di cookie
      const ACCESS_TOKEN_LIFETIME_SECONDS = 15 * 60;
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: ACCESS_TOKEN_LIFETIME_SECONDS * 1000,
      };

      res.cookie("accessToken", newAccessToken, cookieOptions);

      res.json({
        success: true,
        message: "Access token renewed successfully",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      // req.user sudah diset oleh middleware authenticate
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
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (refreshToken) {
        // Hapus refresh token dari database
        await db("refresh_tokens").where({ token: refreshToken }).delete();
      }

      // Clear kedua cookie
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
