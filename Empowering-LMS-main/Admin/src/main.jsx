import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { MediaProvider } from "./modules/media-files/MediaContext";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import { ProfileProvider } from "./modules/profile/context/ProfileContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <MediaProvider>
            <App />
          </MediaProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);