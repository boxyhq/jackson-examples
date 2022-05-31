// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const { op } = req.query;
  switch (op) {
    case 'add':
    // POST /admin/saml/config/add
    case 'list':
    // GET /admin/saml/config
  }
  // check if admin user
  res.status(200).json({ name: 'John Doe' });
}
