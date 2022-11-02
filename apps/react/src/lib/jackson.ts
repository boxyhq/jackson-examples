import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';

const jacksonUrl = 'http://localhost:5225';
const apiUrl = 'http://localhost:3000';
const appUrl = 'http://localhost:3366';

export const oAuth2AuthCodePKCE = (tenant: string, product = 'saml-demo.boxyhq.com') => {
  return new OAuth2AuthCodePKCE({
    authorizationUrl: `${jacksonUrl}/api/oauth/authorize`,
    tokenUrl: `${jacksonUrl}/api/oauth/token`,
    clientId: `tenant=${tenant}&product=${product}`,
    redirectUrl: `${appUrl}/login`,
    scopes: [],
    onAccessTokenExpiry(refreshAccessToken) {
      console.log('Expired! Access token needs to be renewed.');
      alert('We will try to get a new access token via grant code or refresh token.');
      return refreshAccessToken();
    },
    onInvalidGrant(refreshAuthCodeOrRefreshToken) {
      console.log('Expired! Auth code or refresh token needs to be renewed.');
      alert('Redirecting to auth server to obtain a new auth grant code.');
      //return refreshAuthCodeOrRefreshToken();
    },
  });
};

export const authenticate = async (token: string | undefined) => {
  if (!token) {
    throw new Error('Access token not found.');
  }

  await fetch(`${apiUrl}/api/authenticate?access_token=${token}`, {
    method: 'GET',
    credentials: 'include',
  });
};

export const getProfileByJWT = async () => {
  const response = await fetch(`${apiUrl}/api/profile`, {
    method: 'GET',
    credentials: 'include',
  });

  return await response.json();
};
