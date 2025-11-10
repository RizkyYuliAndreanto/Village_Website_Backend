import { Routes, Route } from "react-router-dom";
import routes from "@/routes";

export function Auth() {
  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {routes.map(
          ({ layout, pages }, layoutIndex) =>
            layout === "auth" &&
            pages.map(({ path, element }, pageIndex) => (
              <Route
                key={`${layoutIndex}-${pageIndex}`}
                path={path}
                element={element}
              />
            ))
        )}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layouts/auth.jsx";

export default Auth;
