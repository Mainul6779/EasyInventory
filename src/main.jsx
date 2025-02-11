import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";  
import "./App.css";
import AuthProvider from "./providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={App} />
    </AuthProvider>
  </React.StrictMode>
);
