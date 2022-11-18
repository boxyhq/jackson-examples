import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  let { user, authStatus } = useAuth();
  let location = useLocation();

  if (authStatus === 'FETCHING' || authStatus === 'UNKNOWN') {
    return null;
  }

  if (!user && authStatus === 'LOADED') {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
