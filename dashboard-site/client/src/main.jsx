import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import LOGS from "./LogsPage"
import MongoFiles from "./FilesPage"
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/upload",
    element: <App />,
  },
  {
    path: "/about",
    element: <App />,
  },
  {
    path: "/checklogs",
    element: <LOGS />,
  },
  {
    path: "/checkfiles",
    element: <MongoFiles />,
  },
  {
    path: "/edit/:id",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
