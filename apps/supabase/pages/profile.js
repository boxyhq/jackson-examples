import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Account from '../components/Account';
import Auth from '../components/Auth';

export default function Profile() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className='container' style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  );
}
