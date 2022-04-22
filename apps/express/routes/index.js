const express = require('express');
const router = express.Router();

let apiController;
let oauthController;

const baseUrl = process.env.APP_URL;
const redirectUrl = process.env.REDIRECT_URL;
const product = 'flex';
const tenant = 'boxyhq';
const defaultRedirectUrl = `${baseUrl}/sso/callback`;
const samlPath = '/sso/acs';
const acsUrl = `${baseUrl}${samlPath}`;
const samlAudience = process.env.SAML_AUDIENCE;

const jacksonOptions = {
  externalUrl: baseUrl,
  samlAudience: samlAudience,
  samlPath: samlPath,
  db: {
    engine: 'mongo',
    url: process.env.DB_HOST,
  },
};

(async function init() {
  const jackson = await require('@boxyhq/saml-jackson').controllers(jacksonOptions);

  apiController = jackson.apiController;
  oauthController = jackson.oauthController;
})();

// Show form to add Metadata
router.get('/config/create', async (req, res) => {
  res.render('config/create', { acsUrl });
});

// Store the Metadata
router.post('/config', async (req, res, next) => {
  const { rawMetadata } = req.body;

  try {
    const response = await apiController.config({
      rawMetadata,
      defaultRedirectUrl,
      redirectUrl,
      tenant,
      product,
    });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// Home
router.get('/', async (req, res) => {
  const { provider = null } = await apiController.getConfig({
    tenant,
    product,
  });

  const authorizeUrl = createAuthorizeUrl(tenant, product, defaultRedirectUrl);

  res.render('index', {
    provider,
    authorizeUrl,
    product,
    tenant,
    baseUrl,
    defaultRedirectUrl,
    acsUrl,
    samlAudience,
    info: req.flash('info'),
  });
});

// OAuth 2.0 flow
router.get('/sso/authorize', async (req, res, next) => {
  try {
    const { redirect_url } = await oauthController.authorize(req.query);

    res.redirect(redirect_url);
  } catch (err) {
    next(err);
  }
});

// Handle the SAML Response from Idp
router.post(samlPath, async (req, res, next) => {
  try {
    const { redirect_url } = await oauthController.samlResponse(req.body);

    res.redirect(redirect_url);
  } catch (err) {
    next(err);
  }
});

// Callback (Redirect URL)
router.get('/sso/callback', async (req, res, next) => {
  const { code } = req.query;

  const body = {
    code,
    client_id: `tenant=${tenant}&product=${product}`,
    client_secret: 'dummy',
  };

  try {
    const { access_token } = await oauthController.token(body);

    req.session.access_token = access_token;

    res.redirect('/me');
  } catch (err) {
    next(err);
  }
});

// Get the user profile
router.get('/me', async (req, res, next) => {
  const { access_token } = req.session;

  console.log(req.session);

  if (access_token === undefined) {
    req.flash('info', 'Please login to access /me');
    return res.redirect('/');
  }

  try {
    const profile = await oauthController.userInfo(access_token);

    res.render('me', { profile });
  } catch (err) {
    next(err);
  }
});

// Create the authorize URL
const createAuthorizeUrl = (tenant, product, defaultRedirectUrl) => {
  const url = new URL(`${baseUrl}/sso/authorize`);

  url.searchParams.append('response_type', 'code');
  url.searchParams.append('provider', 'saml');
  url.searchParams.append('client_id', `tenant=${tenant}&product=${product}`);
  url.searchParams.append('redirect_uri', defaultRedirectUrl);
  url.searchParams.append('state', 'a-random-state-value');

  return url.href;
};

module.exports = router;
