import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Authentication from "./authentication";
import VerifyEmail from "./Verifyemail";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/auth", element: <Authentication /> },
  { path: "/verify", element: <VerifyEmail /> }
]);
