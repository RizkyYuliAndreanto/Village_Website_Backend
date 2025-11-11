import rateLimit from "express-rate-limit";

// Rate limiting umum untuk API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // limit setiap IP menjadi 100 request per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
});

// Auth rate limiting (lebih ketat)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Naikkan sedikit untuk mengakomodasi percobaan login
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
});

export { apiLimiter, authLimiter };
