import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Authentication from "./authentication";
import Login from "./Login";
import VerifyEmail from "./Verifyemail";
import Profile from "./Profile";
import Settings from "./settings";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/auth", element: <Authentication /> },
  { path: "/login", element: <Login /> },
  { path: "/verify", element: <VerifyEmail /> },
  { path: "/profile", element: <Profile /> },
  { path: "/settings", element: <Settings /> },
]);
