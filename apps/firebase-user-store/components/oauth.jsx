import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { useState, useEffect, useRef } from 'react';
import { JACKSON_URL } from 'lib/constants';
// import { auth } from 'lib/firebaseAuthSdk';
import { onAuthStateChanged, signInWithCustomToken, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

const json = (response) => {
  return response.json();
};

export default function OAuth() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(null);
  const oauth = useRef(null);
  const firebaseAuth = useRef(null);

  async function initFirebaseSDK() {
    if (!firebaseAuth.current) {
      firebaseAuth.current = await (await import('lib/firebaseAuthSdk')).auth;
    }
    onAuthStateChanged(firebaseAuth.current, (user) => {
      console.log(`onAuthStateChanged::user::`, user);
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setLoggedIn(user);
        router.push('/');
        // ...
      } else {
        // User is signed out
        oauth.current.reset();
        setLoggedIn(null);
        // ...
      }
    });
  }

  useEffect(() => {
    initFirebaseSDK();
    if (!oauth.current)
      oauth.current = new OAuth2AuthCodePKCE({
        extraAuthorizationParams: {
          provider: 'saml',
        },
        scopes: [],
        authorizationUrl: `${JACKSON_URL}/api/oauth/authorize`,
        tokenUrl: `${JACKSON_URL}/api/oauth/token`,
        redirectUrl: 'http://localhost:3366',
        clientId: 'tenant=boxyhq.com&product=saml-demo.boxyhq.com',
        clientSecret: 'dummy',
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

    oauth.current
      .isReturningFromAuthServer()
      .then((hasAuthCode) => {
        // if (!hasAuthCode) {
        //   console.log('Something wrong...no auth code.');
        // }
        return oauth.current.getAccessToken().then((token) => {
          // post the token to server and then fetch userinfo from server and log in the user
          console.log(token.token.value);
          // TODO: Send a request to the server to retrieve the custom token from Firebase
          fetch('/api/login?access_token=' + token.token.value)
            .then(json)
            .then(function (data) {
              console.log('Request succeeded with JSON response', data);
              if (data.token) {
                signInWithCustomToken(firebaseAuth.current, data.token);
                // setLoggedIn(data.email);
                // console.log('Logged in as:', data.email);
                //alert('Logged in as: ' + data.email);
              }
            })
            .catch(function (error) {
              console.log('Request failed', error);
            });
        });
      })
      .catch((potentialError) => {
        if (potentialError) {
          console.log(potentialError);
        }
      });
  }, []);

  const authorize = function () {
    oauth.current.fetchAuthorizationCode();
  };

  return loggedIn ? (
    <div>
      Logged in as:
      <div>
        <pre>{JSON.stringify(loggedIn, null, 2)}</pre>
      </div>
      <button type='button' onClick={() => signOut(firebaseAuth.current)}>
        Sign out
      </button>
    </div>
  ) : (
    <button onClick={authorize}>Client-Side Flow</button>
  );
}
