import React, { useEffect } from 'react';
import { useState, ReactNode, createContext } from 'react';
import useOAuthClient from '../hooks/useOAuthClient';
import { authenticate, getProfileByJWT } from './jackson';

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

  const authClient = useOAuthClient({ tenant });

  useEffect(() => {
    const loadUser = async () => {
      setAuthStatus('FETCHING');
      if (authClient?.isAuthorized()) {
        const { data, error } = await getProfileByJWT();
        if (!error) {
          setUser(data);
        }
        return;
      }
      try {
        const hasAuthCode = await authClient?.isReturningFromAuthServer();
        if (!hasAuthCode) {
          console.error('Something wrong...no auth code.');
        }
        const token = await authClient?.getAccessToken();
        console.log(`🏎️`, token);
        const profile = await authenticate(token?.token?.value);
        setUser(profile);
      } catch (err) {
        console.error(err);
      }
      setAuthStatus('LOADED');
    };
    loadUser();
  }, [authClient]);

  const signIn = async () => {
    // const token = await fakeAuth();  Initiate the login flow
    // setToken(token);
    await authClient?.fetchAuthorizationCode();
    // callback();
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
