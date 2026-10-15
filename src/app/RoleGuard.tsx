import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { UserRole } from '../data/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const currentRole = useStore((s) => s.currentRole);
  const location = useLocation();

  if (!allowedRoles.includes(currentRole)) {
    // Generate helpful explanation of the rule that failed
    let requiredRoleLabel = 'Admin';
    if (allowedRoles.includes('admin') && !allowedRoles.includes('buyer')) {
      requiredRoleLabel = 'Admin';
    } else if (allowedRoles.includes('coordinator')) {
      requiredRoleLabel = 'Coordinator';
    } else if (allowedRoles.includes('buyer')) {
      requiredRoleLabel = 'Buyer';
    }

    const ruleExplanation = `${location.pathname} requires the ${requiredRoleLabel} role; you are currently viewing as ${
      currentRole.charAt(0).toUpperCase() + currentRole.slice(1)
    }.`;

    return (
      <Navigate
        to="/403"
        replace
        state={{
          failedPath: location.pathname,
          requiredRoles: allowedRoles,
          currentRole,
          ruleExplanation,
        }}
      />
    );
  }

  return <>{children}</>;
};
