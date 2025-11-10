import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { logout } from "@/utils/auth";
import { useState } from "react";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [loading, setLoading] = useState(false);

  // Ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    await logout();
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          <Typography variant="h6" color="blue-gray" className="font-medium">
                    {user.name || "User"}
          </Typography>
          
          {/* User Profile Menu Dropdown */}
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <UserCircleIcon className="h-8 w-8 text-blue-gray-500 " />
              </IconButton>
            </MenuHandler>
            
            <MenuList className="w-64">
              {/* User Info Header */}
              <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-blue-gray-50">
                <UserCircleIcon className="h-12 w-12 text-blue-gray-400" />
                <div className="flex flex-col">
                  <Typography variant="h6" color="blue-gray" className="font-semibold">
                    {user.name || "User"}
                  </Typography>
                  <Typography variant="small" color="gray" className="font-normal">
                    {user.email || "user@example.com"}
                  </Typography>
                </div>
              </div>

              {/* Menu Items */}
              <MenuItem className="flex items-center gap-3">
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                <Typography variant="small" className="font-medium">
                  My Profile
                </Typography>
              </MenuItem>
              
              <MenuItem className="flex items-center gap-3">
                <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
                <Typography variant="small" className="font-medium">
                  Settings
                </Typography>
              </MenuItem>

              <hr className="my-2 border-blue-gray-50" />

              {/* Logout */}
              <MenuItem 
                className="flex items-center gap-3 hover:bg-red-50"
                onClick={handleLogout}
                disabled={loading}
              >
                <PowerIcon className="h-5 w-5 text-red-500" />
                <Typography variant="small" className="font-medium text-red-500">
                  {loading ? "Logging out..." : "Logout"}
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
