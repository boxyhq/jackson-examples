import { supabase } from 'utils/supabaseServerClient';

const handler = async (req, res) => {
  await supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
