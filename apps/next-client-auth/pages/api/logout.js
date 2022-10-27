import { withIronSessionApiRoute } from 'iron-session/next';

async function logoutRoute(req, res) {
  try {
    req.session.destroy();
    res.send({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default withIronSessionApiRoute(logoutRoute, {
  cookieName: 'myapp_cookiename',
  password: 'complex_password_at_least_32_characters_long',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
