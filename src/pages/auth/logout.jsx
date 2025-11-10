import { useEffect } from "react";
import { logout } from "@/utils/auth";
import { Typography } from "@material-tailwind/react";

export function LogoutPage() {
  useEffect(() => {
    // Otomatis logout saat halaman dimuat
    logout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <Typography variant="h6" color="blue-gray">
          Logging out...
        </Typography>
      </div>
    </div>
  );
}

export default LogoutPage;