// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import axios from 'axios';

const headers = { Authorization: `Api-Key ${process.env.JACKSON_API_KEY}` };

export default withApiAuth(async function handler(req, res) {
  const { op } = req.query;
  try {
    switch (op) {
      case 'fetch':
        // GET /api/v1/saml/config
        const { tenant, product } = req.query;
        const { data } = await axios.get(
          `${process.env.JACKSON_SERVICE}/api/v1/saml/config?tenant=${tenant}&product=${product}`,
          {
            headers,
          }
        );
        res.json(data);
        break;
      case 'add':
        // POST /api/v1/saml/config
        await axios.post(`${process.env.JACKSON_SERVICE}/api/v1/saml/config`, req.body, {
          headers,
        });
        res.status(204).end();
        break;
      case 'update':
        // PATCH /api/v1/saml/config
        await axios.patch(`${process.env.JACKSON_SERVICE}/api/v1/saml/config`, req.body, {
          headers,
        });
        res.status(204).end();
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(error.response.status || 500).send(error.response.data || 'Internal Server Error');
  }
});
