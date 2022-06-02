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
    <>
      <div className='row'>
        <div className='col-6'>
          <h1 className='text-xl font-bold'>Supabase Auth + BoxyHQSAML</h1>
        </div>
      </div>
      <div className='row'>
        <div className='col-6 auth-widget'>
          <p className='description'>Sign {isSignUp ? 'up' : 'in'} using email/password</p>
          <div>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              className='inputField'
              type='text'
              pattern='^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
              placeholder='Your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              className='inputField'
              type='password'
              placeholder='Your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAdminLogin();
              }}
              className={'button block'}
              disabled={loading}>
              {magicLinkLoading ? (
                <img className='loader' src='loader.svg' />
              ) : (
                <span>{isSignUp ? 'SignUp' : 'SignIn'}</span>
              )}
            </button>
          </div>
          <button onClick={toggleSignUp}>
            {isSignUp ? 'Do you have an account ? Sign in' : "Don't have an account ? Sign up"}
          </button>
        </div>
        <div className='col-6 auth-widget'>
          <p className='description'>Sign in via BoxyHQSAML</p>
          <div>
            <label htmlFor='tenant'>Tenant</label>
            <input
              id='tenant'
              className='inputField'
              type='text'
              pattern='^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
              placeholder='Your tenant'
              defaultValue={SAML_TENANT}
              readOnly
            />
          </div>
          <div>
            <label htmlFor='product'>Product</label>
            <input
              id='product'
              className='inputField'
              type='text'
              pattern='^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
              placeholder='Your product'
              defaultValue={SAML_PRODUCT}
              readOnly
            />
          </div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className={'button block'}
              disabled={loading}>
              {loading ? <img className='loader' src='loader.svg' /> : <span>Proceed</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
