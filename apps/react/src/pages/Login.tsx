import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  let location = useLocation();

  let from = location.state?.from?.pathname || '/profile';

  const { signIn, setTenant, authStatus, user } = useAuth();

  if (authStatus !== 'LOADED') {
    return null;
  }

  if (authStatus === 'LOADED' && user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className='mx-auto h-screen max-w-7xl'>
      <div className='flex h-full flex-col justify-center space-y-5'>
        <h2 className='text-center text-3xl'>Log in to App</h2>
        <div className='mx-auto w-full max-w-md px-3 md:px-0'>
          <div className='rounded border border-gray-200 bg-white py-5 px-5'>
            <form className='space-y-3' method='POST' onSubmit={signIn}>
              <label htmlFor='tenant' className='block text-sm'>
                Tenant ID
              </label>
              <input
                type='text'
                name='tenant'
                placeholder='boxyhq'
                defaultValue='boxyhq.com'
                className='block w-full appearance-none rounded border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500'
                required
                onChange={(e) => typeof setTenant === 'function' && setTenant(e.target.value)}
              />
              <button
                type='submit'
                className='w-full rounded border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus:outline-none'>
                Continue with SAML SSO
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
