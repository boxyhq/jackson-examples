import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  let location = useLocation();

  let from = location.state?.from?.pathname || '/profile';

  const { signIn, setTenant, authStatus, user } = useAuth();

  if (authStatus !== 'LOADED') {
    return null;
  }

  if (authStatus === 'LOADED' && user) {
    return <Navigate to={from} replace />;
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tenant = e.target.value.split('@')[1];

    if (typeof setTenant === 'function') {
      setTenant(tenant);
    }
  };

  return (
    <div className='mx-auto h-screen max-w-7xl'>
      <div className='flex h-full flex-col justify-center space-y-5'>
        <h2 className='text-center text-3xl'>Login with SAML SSO</h2>
        <div className='mx-auto w-full max-w-md px-3 md:px-0'>
          <div className='rounded border border-gray-200 bg-white px-5 py-5'>
            <form className='space-y-3' method='POST' onSubmit={signIn}>
              <label htmlFor='tenant' className='block text-sm'>
                Work Email
              </label>
              <input
                type='email'
                name='email'
                placeholder='jackson@example.com'
                defaultValue='jackson@example.com'
                className='block w-full appearance-none rounded border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500'
                required
                onChange={onChange}
              />
              <button
                type='submit'
                className='w-full rounded border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus:outline-none'>
                Continue with SAML SSO
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
