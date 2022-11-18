import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { useEffect, useState } from 'react';

const JACKSON_URL = 'http://localhost:5225';
const APP_URL = 'http://localhost:3366';

interface OauthClientOptions {
  tenant: string;
  product?: string;
}
export default function useOAuthClient({ tenant, product = 'saml-demo.boxyhq.com' }: OauthClientOptions) {
  const [oauthClient, setOauthClient] = useState<OAuth2AuthCodePKCE | null>(null);

  useEffect(() => {
    setOauthClient(
      new OAuth2AuthCodePKCE({
        authorizationUrl: `${JACKSON_URL}/api/oauth/authorize`,
        tokenUrl: `${JACKSON_URL}/api/oauth/token`,
        clientId: `tenant=${tenant}&product=${product}`,
        redirectUrl: `${APP_URL}/login`,
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
  }, [product, tenant]);

  // useEffect(() => {
  //   const oAuthCallback = async () => {
  //     if (!oauthClient) return;
  //     try {
  //       const hasAuthCode = await oauthClient.isReturningFromAuthServer();
  //       if (!hasAuthCode) {
  //         console.error('Something wrong...no auth code.');
  //       }
  //       const token = await oauthClient.getAccessToken();
  //       await authenticate(token.token?.value);
  //       navigate(from, { replace: true });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   oAuthCallback();
  // }, [oauthClient]);

  return oauthClient;
}
