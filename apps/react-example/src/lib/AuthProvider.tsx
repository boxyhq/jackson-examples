import React, { useState, useEffect, ReactNode, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import useOAuthClient from '../hooks/useOAuthClient';
import { authenticate, getProfileByJWT } from './backend';
import devLogger from './devLogger';

interface ProviderProps {
  children: ReactNode;
}

interface AuthContextInterface {
  setTenant?: React.Dispatch<React.SetStateAction<string>>;
  authStatus: 'UNKNOWN' | 'FETCHING' | 'LOADED';
  user: any;
  signIn: () => void;
  signOut: (callback: VoidFunction) => void;
}

// localstorage key to store from url
const APP_FROM_URL = 'appFromUrl';

const AuthContext = createContext<AuthContextInterface>(null!);

const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [tenant, setTenant] = useState('boxyhq.com');
  const [authStatus, setAuthStatus] = useState<AuthContextInterface['authStatus']>('UNKNOWN');

  let location = useLocation();
  let from = location.state?.from?.pathname || localStorage.getItem(APP_FROM_URL) || '/profile';

  const redirectUrl = process.env.REACT_APP_APP_URL + from;

  const product = process.env.REACT_APP_BOXYHQ_PRODUCT || 'saml-demo.boxyhq.com';

  const authClient = useOAuthClient({ redirectUrl });

  useEffect(() => {
    let didCancel = false;

    const loadUser = async () => {
      if (!authClient) {
        return;
      }
      setAuthStatus('FETCHING');
      if (authClient.isAuthorized()) {
        devLogger(`authClient is already authorized`);
        const { data, error } = await getProfileByJWT();
        if (!didCancel && !error) {
          setUser(data);
          setAuthStatus('LOADED');
        }
      } else {
        try {
          const hasAuthCode = await authClient?.isReturningFromAuthServer();
          if (!hasAuthCode) {
            devLogger('no auth code detected...');
          } else {
            devLogger(authClient);
            const token = !didCancel ? await authClient?.getAccessToken() : null;
            token && localStorage.removeItem(APP_FROM_URL);
            const profile = await authenticate(token?.token?.value);
            if (!didCancel && profile) {
              setUser(profile);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setAuthStatus('LOADED');
        }
      }
    };

    devLogger(`running effect loadUser`);
    loadUser();
    return () => {
      devLogger(`cancelling effect`);
      didCancel = true;
    };
  }, [authClient]);

  const signIn = async () => {
    // store the from url before redirecting ... we need this to correctly initialize the oauthClient after getting redirected back from SSO Provider.
    localStorage.setItem(APP_FROM_URL, from);
    // Initiate the login flow
    await authClient?.fetchAuthorizationCode({
      tenant,
      product,
    });
  };

  const signOut = async (callback: VoidFunction) => {
    authClient?.reset();
    setUser(null);
    callback();
  };

  const value = {
    authStatus,
    user,
    setTenant,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
