import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from '@auth0/auth0-react';
import history from './utils/history';
import { getConfig } from './config';

const onRedirectCallback = (appState) => {
  history.push(appState && appState.returnTo ? appState.returnTo : window.location.pathname);
};

// Please see https://auth0.github.io/auth0-react/interfaces/Auth0ProviderOptions.html
// for a full list of the available properties on the provider
const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  ...(config.audience ? { audience: config.audience } : null),
  redirectUri: window.location.origin + '/profile',
  onRedirectCallback,
};
const TENANT_RE = /[?&]tenant=[^&]+/;

function Index() {
  const searchParams = window.location.search;
  const hasTenantParams = TENANT_RE.test(searchParams);
  const tenant = (hasTenantParams && new URLSearchParams(searchParams).get('tenant')) || '';

  return (
    <Auth0Provider {...providerConfig} access_type={`tenant=${tenant}&product=saml-demo.auth0.com`}>
      <App />
    </Auth0Provider>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
