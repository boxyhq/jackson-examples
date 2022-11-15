import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { useState, ReactNode, createContext } from 'react';

interface ProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({});

const AuthProvider = ({ children }: ProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async ({ tenant, authClient }: { tenant: string; authClient: OAuth2AuthCodePKCE }) => {
    // const token = await fakeAuth();  Initiate the login flow
    // setToken(token);
    authClient.fetchAuthorizationCode();
  };

  const handleLogout = (authClient: OAuth2AuthCodePKCE) => {
    // setToken(null);
    authClient.reset();
  };

  const value = {
    isLoggedIn,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
