// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";

// /**
//  * ProtectedRoute wrapper
//  * - Jika tidak ada accessToken -> redirect ke /auth/login
//  * - Jika requiredRole diberikan dan user.role !== requiredRole -> redirect ke /auth/login
//  *
//  * Mengandalkan localStorage keys:
//  * - "accessToken" (string)
//  * - "user" (JSON string dengan properti role, mis. { role: "admin" })
//  */
// export default function ProtectedRoute({ children, requiredRole }) {
//   const location = useLocation();
//   const token = localStorage.getItem("accessToken");
//   let user = null;
//   try {
//     const u = localStorage.getItem("user");
//     if (u) user = JSON.parse(u);
//   } catch (e) {
//     user = null;
//   }

//   if (!token) {
//     // belum login -> redirect ke login, simpan lokasi asal di state
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   if (requiredRole && (!user || user.role !== requiredRole)) {
//     // tidak punya role yang diperlukan -> redirect (bisa juga ke halaman 403)
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   return children;
// }