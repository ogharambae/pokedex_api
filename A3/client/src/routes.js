import { React } from "react";
import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import App from "./pages/App";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/home",
        element: <App />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "admin",
        element: <Admin />
    }
]);

export default router;