import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Loading from '../loading';
import NotPermitted from './not-permitted';

// Helper function to normalize role (handle both number ID and string name)
const normalizeRole = (role) => {
  if (!role) return null;

  // If it's already a string, return as is
  if (typeof role === 'string') {
    return role;
  }

  // If it's a number, map to role name
  const roleMap = {
    1: 'ADMIN',
    2: 'PATIENT',
    3: 'DOCTOR',
    4: 'CASHIER',
  };

  return roleMap[role] || null;
};

// Staff role-based route protection (only DOCTOR and CASHIER can access)
const StaffRoleRoute = (props) => {
  const user = useSelector((state) => state.account.user);
  const role = normalizeRole(user?.role);

  if (role === 'DOCTOR' || role === 'CASHIER') {
    return <>{props.children}</>;
  } else {
    return <NotPermitted />;
  }
};

const ProtectedStaffRoute = (props) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const isLoading = useSelector((state) => state.account.isLoading);

  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setRedirectToLogin(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (redirectToLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {isLoading === true ? (
        <Loading />
      ) : (
        <>
          {isAuthenticated === true ? (
            <>
              <StaffRoleRoute>{props.children}</StaffRoleRoute>
            </>
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )}
        </>
      )}
    </>
  );
};

StaffRoleRoute.propTypes = {
  children: PropTypes.node,
};
ProtectedStaffRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedStaffRoute;
