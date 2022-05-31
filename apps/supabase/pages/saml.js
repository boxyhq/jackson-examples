import { supabase } from '../utils/supabaseClient';

export default function SamlConfig() {
  return (
    <div className='container'>
      Saml
      <button className='button block' onClick={() => supabase.auth.signOut()}>
        Sign Out
      </button>
    </div>
  );
}
