const jwt = require('jsonwebtoken');

// Generate the JWT so that we can send it along with Hasura API request
const generateJWT = (profile) => {
  const allowedRoles = ['admin', 'developer'];
  const defaultRole = 'developer'; // This role can come from the identity provider's attributes

  const payload = {
    sub: profile.id,
    name: profile.name,
    email: profile.email,
    iat: Date.now() / 1000,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': allowedRoles,
      'x-hasura-default-role': defaultRole,
      'x-hasura-role': defaultRole,
      'x-hasura-user-id': profile.id,
    },
  };

  return jwt.sign(payload, process.env.HASURA_JWT_SECRET, {
    algorithm: 'HS256',
  });
};

// Parse the JWT and return the claims
const decodeJwt = (token) => {
  return jwt.verify(token, process.env.HASURA_JWT_SECRET, {
    algorithms: ['HS256'],
  });
};

const redirectIfNotAuthenticated = (req, res) => {
  const { token } = req.session;

  if (token === undefined) {
    req.flash('info', 'Please login to access /me');

    return res.redirect('/login');
  }
};

module.exports = {
  generateJWT,
  decodeJwt,
  redirectIfNotAuthenticated,
};
