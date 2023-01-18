const baseUrl = process.env.APP_URL;
const samlAudience = process.env.SAML_AUDIENCE || 'https://saml.boxyhq.com';

const product = 'saml-demo.boxyhq.com';
const samlPath = '/api/oauth/saml';
const redirectUrl = `${baseUrl}/sso/callback`;

// SAML Jackson options
const options = {
  externalUrl: baseUrl,
  samlAudience,
  samlPath,
  db: {
    engine: 'sql',
    type: 'postgres',
    url: process.env.DB_HOST,
  },
  openid: {
    jwsAlg: 'RS256',
    jwtSigningKeys: {
      private: process.env.OPENID_RSA_PRIVATE_KEY,
      public: process.env.OPENID_RSA_PUBLIC_KEY,
    },
  },
};

module.exports = {
  baseUrl,
  product,
  samlPath,
  redirectUrl,
  samlAudience,
  options,
};
