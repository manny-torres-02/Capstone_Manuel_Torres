import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EditEventPage from "./pages/EditEvent/EditEventPage";
import CreateVolunteerPage from "./pages/CreateVolunteer/CreateVolunteerPage";
import EditVolunteerPage from "./pages/EditVolunteer/EditVolunteerPage";
import CreateEventPage from "./pages/CreateEvent/CreateEventPage";
import "./index.css";
import App from "./App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/createVolunteer", element: <CreateVolunteerPage /> },
      { path: "/:id/editVolunteer", element: <EditVolunteerPage /> },
      { path: "/createEvent", element: <CreateEventPage /> },
      { path: "/:id/editEvent", element: <EditEventPage /> },
      // other routes...
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
