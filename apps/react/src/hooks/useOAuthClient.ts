import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { useEffect, useState } from 'react';
import devLogger from '../lib/devLogger';

const JACKSON_URL = 'http://localhost:5225';

interface OauthClientOptions {
  redirectUrl: string;
}
export default function useOAuthClient({ redirectUrl }: OauthClientOptions): OAuth2AuthCodePKCE | null {
  const [oauthClient, setOauthClient] = useState<OAuth2AuthCodePKCE | null>(null);

  useEffect(() => {
    devLogger('initializing new oauthclient with redirectUrl: ' + redirectUrl);
    setOauthClient(
      new OAuth2AuthCodePKCE({
        authorizationUrl: `${JACKSON_URL}/api/oauth/authorize`,
        tokenUrl: `${JACKSON_URL}/api/oauth/token`,
        clientId: 'dummy',
        redirectUrl,
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
      })
    );
  }, [redirectUrl]);

  return oauthClient;
}
