import { Link } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center px-4">
        <Typography variant="h1" className="text-9xl font-bold text-blue-gray-900">
          404
        </Typography>
        <Typography variant="h3" className="mt-4 text-3xl font-semibold text-blue-gray-700">
          Page Not Found
        </Typography>
        <Typography className="mt-4 text-lg text-blue-gray-500 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/">
            <Button variant="filled" color="blue">
              Go to Home
            </Button>
          </Link>
          <Link to="/admin/dashboard">
            <Button variant="outlined" color="blue">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;