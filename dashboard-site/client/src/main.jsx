import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import "./index.css";
import LoginButton from "./components/LoginButton";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <RecordList />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <Record />,
      },
    ],
  },
  {
    path: "/login",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginButton />,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="https://dev-hox5qzwcq2d1c7c5.us.auth0.com"
      clientId="wzVkLKweercBH98F6OBlPKhWWONVSwgX"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}>
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);