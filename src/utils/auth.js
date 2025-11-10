const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3100";

export async function logout() {
  try {
    // Panggil endpoint logout untuk hapus refresh token dari DB
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "DELETE",
      credentials: "include", // kirim cookie
    });

    // Clear localStorage
    localStorage.clear();

    // Redirect ke login
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout error:", error);
    // Tetap clear localStorage dan redirect meskipun API gagal
    localStorage.clear();
    window.location.href = "/auth/login";
  }
}