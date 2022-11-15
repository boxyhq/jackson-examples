import { useContext } from 'react';
import { AuthContext } from '../lib/authProvider';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
