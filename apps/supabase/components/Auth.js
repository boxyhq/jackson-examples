import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [tenant, setTenant] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error, user } = await supabase.auth.signIn(
        { provider: 'boxyhqsaml' },
        {
          scopes: `tenant=${tenant}&product=supabase`,
          redirectTo: 'http://localhost:3366/profile',
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

  const handleMagicLink = async () => {
    try {
      setMagicLinkLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert('Check your email for the login link!');
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
          <h1 className='header'>Supabase Auth + BoxyHQSAML</h1>
        </div>
      </div>
      <div className='row'>
        <div className='col-6 auth-widget'>
          <p className='description'>Sign in via Magic Link</p>
          <div>
            <input
              className='inputField'
              type='text'
              pattern='^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
              placeholder='Your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleMagicLink();
              }}
              className={'button block'}
              disabled={loading}>
              {magicLinkLoading ? <img className='loader' src='loader.svg' /> : <span>SignIn</span>}
            </button>
          </div>
        </div>
        <div className='col-6 auth-widget'>
          <p className='description'>Sign in via BoxyHQSAML</p>
          <div>
            <input
              className='inputField'
              type='text'
              pattern='^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
              placeholder='Your tenant'
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
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
