import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useOAuthClient from '../hooks/useOAuthClient';

import { oAuth2AuthCodePKCE, authenticate } from '../lib/jackson';

const Login = () => {
  const [tenant, setTenant] = useState('boxyhq.com');
  const navigate = useNavigate();

  const authClient = useOAuthClient(tenant);
  const { onLogin } = useAuth();

  // const oauth = oAuth2AuthCodePKCE(tenant);

  // // Start the authorize flow
  // const authorize = () => {
  //   oauth.fetchAuthorizationCode();
  // };

  return (
    <div className='mx-auto h-screen max-w-7xl'>
      <div className='flex h-full flex-col justify-center space-y-5'>
        <h2 className='text-center text-3xl'>Log in to App</h2>
        <div className='mx-auto w-full max-w-md px-3 md:px-0'>
          <div className='rounded border border-gray-200 bg-white py-5 px-5'>
            <form className='space-y-3' method='POST' onSubmit={onLogin}>
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
                onChange={(e) => setTenant(e.target.value)}
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
