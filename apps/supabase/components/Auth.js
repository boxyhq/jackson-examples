import { LockClosedIcon, MailIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const SAML_TENANT = process.env.NEXT_PUBLIC_TENANT;
const SAML_PRODUCT = process.env.NEXT_PUBLIC_PRODUCT;

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  function toggleSignUp() {
    setIsSignUp(!isSignUp);
  }

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error, user } = await supabase.auth.signIn(
        { provider: 'boxyhqsaml' },
        {
          scopes: `tenant=${SAML_TENANT}&product=${SAML_PRODUCT}`,
          redirectTo: 'http://localhost:3366/',
        }
      );
      if (error) throw error;
      console.log('user', user);
      // alert("Check your email for the login link!");
    } catch (error) {
      console.log('Error thrown:', error.message);
      // alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setMagicLinkLoading(true);
      const { error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signIn({ email, password });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setMagicLinkLoading(false);
    }
  };

  return (
    <div className='m-auto max-w-[500px]'>
      <h1 className='text-xl font-bold'>Supabase Auth + BoxyHQSAML</h1>
      <div>
        <p className='my-3'>Auth via email/password</p>
        <div className='mb-2'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
            Email
          </label>
          <div className='relative mt-1 rounded-md shadow-sm'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2'>
              <span className='text-gray-500 sm:text-sm'>
                <MailIcon className='h-4 w-4' />
              </span>
            </div>
            <input
              id='email'
              className='block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              name='email'
              type='email'
              placeholder='Your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className='mb-2'>
          <label htmlFor='password' className='mb-1 block text-sm font-medium text-gray-700'>
            Password
          </label>
          <div className='relative mt-1 rounded-md shadow-sm'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2'>
              <span className='text-gray-500 sm:text-sm'>
                <LockClosedIcon className='h-4 w-4' />
              </span>
            </div>
            <input
              id='password'
              className='block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              type='password'
              placeholder='Your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className='mt-4 flex gap-2'>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAdminLogin();
            }}
            className='btn-primary'
            disabled={loading}>
            {magicLinkLoading ? (
              <img className='loader' src='loader.svg' />
            ) : (
              <span>{isSignUp ? 'SignUp' : 'SignIn'}</span>
            )}
          </button>
          <button onClick={toggleSignUp} className='btn-secondary'>
            {isSignUp ? 'Do you have an account ? Sign in' : "Don't have an account ? Sign up"}
          </button>
        </div>
      </div>
      <div className='mt-10'>
        <p className='my-3'>Auth via BoxyHQSAML</p>
        <div className='mb-2'>
          <label htmlFor='tenant' className='mb-1 block text-sm font-medium text-gray-700'>
            Tenant
          </label>
          <input
            id='tenant'
            className='block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            type='text'
            pattern='^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
            placeholder='Your tenant'
            defaultValue={SAML_TENANT}
            readOnly
          />
        </div>
        <div>
          <label htmlFor='product' className='mb-1 block text-sm font-medium text-gray-700'>
            Product
          </label>
          <input
            id='product'
            className='block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            type='text'
            pattern='^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
            placeholder='Your product'
            defaultValue={SAML_PRODUCT}
            readOnly
          />
        </div>
        <div className='mt-4'>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className={'btn-primary'}
            disabled={loading}>
            {loading ? <img className='loader' src='loader.svg' /> : <span>Proceed</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
