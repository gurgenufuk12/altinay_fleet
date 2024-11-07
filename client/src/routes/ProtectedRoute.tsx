import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const ProtectedRoute = ({
  component: Component,
  adminOnly = false,
}: {
  component: React.ComponentType<any>;
  adminOnly?: boolean;
}) => {
  const authContext = React.useContext(AuthContext);
  const user = authContext?.userProfile;
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }
  if (isLoggedIn && adminOnly) {
    if (user?.userRole !== "admin") {
      return <Navigate to="/" />;
    }
  }
  return <Component />;
};
