import { useContext } from 'react';
import { AuthContext } from '../lib/AuthProvider';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
