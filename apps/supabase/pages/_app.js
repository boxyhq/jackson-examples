import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Auth from '../components/Auth';
import '../styles/globals.css';
import { supabase } from '../utils/supabaseClient';

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
    <div style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Component {...pageProps} session={session} />}
    </div>
  );
}

export default MyApp;
