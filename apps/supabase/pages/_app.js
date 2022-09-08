import { LogoutIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Auth from '../components/Auth';
import '../styles/globals.css';
import { supabase } from 'utils/supabaseClient';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      axios.post('/api/set-supabase-cookie', { event: _event, session: session });
      if (_event === 'SIGNED_OUT') {
        router.push('/');
      }
    });
  }, []);

  return (
    <div className='theme-default h-full'>
      {!session ? (
        <Auth />
      ) : (
        <>
          <header className='fixed top-2 right-2'>
            <p className='flex items-center text-gray-500'>
              Logged in as <strong className='text-black'>&nbsp;{session.user?.email}</strong>
              <button
                type='button'
                className='ml-2 rounded-full border-2 border-indigo-500/75 p-2'
                onClick={() => supabase.auth.signOut()}>
                <LogoutIcon className='h-5 w-5' />
                <span className='sr-only' aria-hidden>
                  Log Out
                </span>
              </button>
            </p>
          </header>
          <div className='relative top-[3rem] h-[calc(100%-3rem)] overflow-auto py-4'>
            <Component {...pageProps} session={session} />
          </div>
        </>
      )}
    </div>
  );
}

export default MyApp;
