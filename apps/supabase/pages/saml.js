import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function SamlConfig({ session }) {
  const router = useRouter();

  useEffect(() => {
    if (session) {
      checkForNonAdmin();
    }
  }, [session]);

  async function checkForNonAdmin() {
    const user = supabase.auth.user();
    if (user?.email !== 'admin@example.com') {
      router.push('/');
    }
  }
  return (
    <div className='container'>
      Saml configs
      <div className='row'>
        <button className='button col-3' onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
