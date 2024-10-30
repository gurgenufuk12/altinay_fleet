import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  component: Component,
  adminOnly = false,
}: {
  component: React.ComponentType<any>;
  adminOnly?: boolean;
}) => {
  const userProfile = localStorage.getItem("userProfile");

  if (!userProfile) {
    return <Navigate to="/signin" />;
  }
  if (userProfile && adminOnly) {
    const parsedProfile = JSON.parse(userProfile);
    if (parsedProfile.userRole !== "admin") {
      return <Navigate to="/" />;
    }
  }
  return <Component />;
};
