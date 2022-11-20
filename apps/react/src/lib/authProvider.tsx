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

const AuthContext = createContext<AuthContextInterface>(null!);

const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [tenant, setTenant] = useState('boxyhq.com');
  const [authStatus, setAuthStatus] = useState<AuthContextInterface['authStatus']>('UNKNOWN');

  let location = useLocation();
  let from = location.state?.from?.pathname || '/profile';

  const redirectUrl = process.env.REACT_APP_APP_URL + from;

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
            const token = await authClient?.getAccessToken();
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
    // Initiate the login flow
    await authClient?.fetchAuthorizationCode({ tenant, product: 'saml-demo.boxyhq.com' });
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
