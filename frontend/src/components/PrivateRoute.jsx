import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles = [] }) => {
  const { keycloak } = useKeycloak();

  if (!keycloak.authenticated) {
    return <Navigate to="/" replace />;
  }

  if (roles.length > 0) {
    const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
    const hasRole = roles.some((role) => userRoles.includes(role));
    if (!hasRole) return <div>Access Denied</div>;
  }

  return children;
};

export default PrivateRoute;
