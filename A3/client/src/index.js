import React from 'react';
import ReactDOM from 'react-dom/client';
import router from "./routes";
import './index.css';

import { RouterProvider } from "react-router-dom";
import { CssBaseline } from "@mui/material";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline>
      <RouterProvider router={router} />
    </CssBaseline>
  </React.StrictMode>
);