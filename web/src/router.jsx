import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { AuthenticationForm } from "./AuthenticationForm";
import VerifyEmail from "./Verifyemail";
import Profile from "./Profile";

import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <AuthenticationForm />
      </AuthProvider>
    ),
  },

  {
    path: "/app",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },

  {
    path: "/verify",
    element: (
      <AuthProvider>
        <VerifyEmail />
      </AuthProvider>
    ),
  },

  {
    path: "/profile",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
]);
