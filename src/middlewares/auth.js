import jwt from "jsonwebtoken";

export async function authenticate(req, res, next) {
  try {
    // Ambil access token dari cookie (bukan dari header lagi)
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

export async function refreshTokenMiddleware(req, res, next) {
  // Middleware ini sebenarnya tidak diperlukan lagi karena refreshToken() sudah handle validasi sendiri
  // Tapi bisa dipakai untuk logging atau rate limiting
  next();
}
