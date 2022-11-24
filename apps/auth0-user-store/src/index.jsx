import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import ErrorPage from './error-page';
import Tenant from './routes/tenant';
import Profile from './routes/Profile';
import Home from './routes/Home';

const TENANT_RE = /[?&]tenant=[^&]+/;

function Index() {
  const searchParams = window.location.search;
  const hasTenantParams = TENANT_RE.test(searchParams);
  const tenant = (hasTenantParams && new URLSearchParams(searchParams).get('tenant')) || '';

  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    navigate(appState && appState.returnTo ? appState.returnTo : window.location.pathname);
  };
  const providerConfig = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENTID,
    redirectUri: window.location.origin + '/profile',
    onRedirectCallback,
  };

  return (
    <Auth0Provider {...providerConfig} resource={`tenant=${tenant}&product=saml-demo.auth0.com`}>
      <App />
    </Auth0Provider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/tenant',
        element: <Tenant />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
