import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { AuthenticationForm } from "./AuthenticationForm";  // FIXED
import VerifyEmail from "./Verifyemail";
import Settings from "./settings";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },

  // ⭐ Your new login + signup page (Mantine)
  { path: "/auth", element: <AuthenticationForm /> },   // FIXED

  { path: "/verify", element: <VerifyEmail /> },
  { path: "/profile", element: <Navigate to="/settings" replace /> },
  { path: "/settings", element: <Settings /> },
]);
