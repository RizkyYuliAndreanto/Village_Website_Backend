import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  PowerIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Dashboard, Profile, Tables, Notifications } from "@/pages/admin";
import { Login, LogoutPage } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "admin",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "users",
        path: "/users",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "Login",
        path: "/login",
        element: <Login />,
      },
      {
        icon: <PowerIcon {...icon} />,
        name: "Logout",
        path: "/logout",
        element: <LogoutPage />,
      },
    ],
  },
];

export default routes;
