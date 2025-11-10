import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [userRole, setUserRole] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3100";

  useEffect(() => {
    // Validasi session dengan memanggil endpoint /me
    async function checkAuth() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include", // kirim cookie accessToken
        });

        if (res.ok) {
          const data = await res.json();
          const user = data?.data?.user;

          // Simpan user data ke localStorage untuk keperluan UI
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            setUserRole(user.role);
          }

          setIsAuthenticated(true);
        } else {
          // Token invalid/expired - coba refresh
          const refreshRes = await fetch(
            `${API_BASE}/api/auth/refresh-token`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (refreshRes.ok) {
            // Refresh berhasil, coba lagi ambil profile
            const retryRes = await fetch(`${API_BASE}/api/auth/me`, {
              credentials: "include",
            });

            if (retryRes.ok) {
              const data = await retryRes.json();
              const user = data?.data?.user;

              if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                setUserRole(user.role);
              }

              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } else {
            // Refresh gagal - tidak ada session valid
            localStorage.clear();
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.clear();
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, [API_BASE]);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}