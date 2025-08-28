import React from 'react';
import { Navigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const PrivateRoute = ({ children, roles = [] }) => {
  const { keycloak } = useKeycloak();

  if (!keycloak?.authenticated) return <Navigate to="/" replace />;

  if (roles.length > 0) {
    const userRoles = keycloak?.tokenParsed?.realm_access?.roles || [];
    const allowed = roles.some(r => userRoles.includes(r));
    if (!allowed) return <div className="p-4 text-red-600">Unauthorized</div>;
  }

  return children;
};

export default PrivateRoute;
