import { Route, Routes } from "react-router-dom";
import Root from "../pages/Root";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import CarFn from "../pages/CarFn";
import Profile from "../pages/Profile";
import Registration from "../pages/Registration";
import RouteGuard from "../utils/RouteGuard";

const routes = [
  { path: "/", element: <RouteGuard element={<Root />} /> },
  { path: "/profile", element: <RouteGuard element={<Profile />} /> },
  { path: "/carfn", element: <RouteGuard element={<CarFn />} /> },
  { path: "/register", element: <RouteGuard element={<Registration />} /> },
  { path: "/login", element: <Login /> }, 
  { path: "/sign-up", element: <SignUp /> }, 
];

const Path = () => {
  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

export default Path;
