import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from '@auth0/auth0-react';
import history from './utils/history';

const onRedirectCallback = (appState) => {
  history.push(appState && appState.returnTo ? appState.returnTo : window.location.pathname);
};

const providerConfig = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENTID,
  redirectUri: window.location.origin + '/profile',
  onRedirectCallback,
};
const TENANT_RE = /[?&]tenant=[^&]+/;

function Index() {
  const searchParams = window.location.search;
  const hasTenantParams = TENANT_RE.test(searchParams);
  const tenant = (hasTenantParams && new URLSearchParams(searchParams).get('tenant')) || '';

  return (
    <Auth0Provider {...providerConfig} resource={`tenant=${tenant}&product=saml-demo.boxyhq.com`}>
      <App />
    </Auth0Provider>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
