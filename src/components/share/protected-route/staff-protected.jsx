import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Loading from '../loading';
import NotPermitted from './not-permitted';

// Staff role-based route protection (only DOCTOR and CASHIER can access)
const StaffRoleRoute = (props) => {
  const user = useSelector((state) => state.account.user);

  if (user.role === 'DOCTOR' || user.role === 'CASHIER') {
    return <>{props.children}</>;
  } else {
    return <NotPermitted />;
  }
};

const ProtectedStaffRoute = (props) => {
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
    return <Navigate to='/login' replace />;
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
            <Navigate to='/login' replace />
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