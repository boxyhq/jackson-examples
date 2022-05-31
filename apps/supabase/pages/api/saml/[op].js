// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
export default async function handler(req, res) {
  const { op } = req.query;
  try {
    switch (op) {
      case 'add':
      // POST /admin/saml/config/add
      case 'list':
        // GET /admin/saml/config
        const _response = await axios.get(`${process.env.API_URL}/admin/saml/config`, {
          headers: { Authorization: `Bearer ${process.env.JACKSON_API_KEY}` },
        });

      case 'update':
      // PATCH /admin/saml/config/update
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
