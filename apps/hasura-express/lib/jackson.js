const baseUrl = process.env.APP_URL;
const samlAudience = process.env.SAML_AUDIENCE || 'https://saml.boxyhq.com';

const product = 'saml-demo.boxyhq.com';
const samlPath = '/sso/acs';
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
};

module.exports = {
  baseUrl,
  product,
  samlPath,
  redirectUrl,
  samlAudience,
  options,
};
