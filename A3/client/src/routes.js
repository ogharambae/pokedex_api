import { React } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import App from "./pages/App";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/home",
        element: <App />
    }
]);

export default router;