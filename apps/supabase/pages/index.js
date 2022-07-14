import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Account from '../components/Account';
import { supabase } from '../utils/supabaseClient';

export default function Profile({ session }) {
  const router = useRouter();

  useEffect(() => {
    if (session) {
      checkForAdmin();
    }
  }, [session]);

  async function checkForAdmin() {
    const user = supabase.auth.user();
    if (user?.email === 'admin@example.com') {
      router.push('/saml');
    }
  }

  return <Account key={session.user.id} session={session} />;
}
