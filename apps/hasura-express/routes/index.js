const express = require('express');
const router = express.Router();
const { generateJWT, decodeJwt, redirectIfNotAuthenticated } = require('../lib/utils');
const { getUsers, createUser, getUserByEmail } = require('../lib/users');

let apiController;
let oauthController;

const tenant = 'boxyhq.com';
const product = 'jackson';

const baseUrl = process.env.APP_URL;
const redirectUrl = process.env.REDIRECT_URL;
const defaultRedirectUrl = `${baseUrl}/sso/callback`;
const samlPath = '/sso/acs';
const acsUrl = `${baseUrl}${samlPath}`;
const samlAudience = process.env.SAML_AUDIENCE;

const jacksonOptions = {
  externalUrl: baseUrl,
  samlAudience: samlAudience,
  samlPath: samlPath,
  db: {
    engine: process.env.DB_ENGINE,
    url: process.env.DB_URL,
    type: process.env.DB_TYPE,
  },
};

(async function init() {
  const jackson = await require('@boxyhq/saml-jackson').controllers(jacksonOptions);

  apiController = jackson.apiController;
  oauthController = jackson.oauthController;
})();

// Configure SAML SSO: Show the form to configure SSO
router.get('/configure', async (req, res) => {
  const { config = null } = await apiController.getConfig({
    tenant,
    product,
  });

  const params = {
    defaultRedirectUrl,
    redirectUrl,
    acsUrl,
    samlAudience,
    idpMetadata: config ? config : null,
  };

  res.render('saml', { params });
});

// Configure SAML SSO: Save the SAML SSO configuration
router.post('/configure', async (req, res) => {
  const { metadata } = req.body;

  const response = await apiController.config({
    rawMetadata: metadata,
    defaultRedirectUrl,
    redirectUrl: JSON.stringify([redirectUrl]),
    tenant,
    product,
  });

  res.redirect('/configure');
});

// Home
router.get('/', async (req, res) => {
  res.render('index');
});

// Display login form
router.get('/login', async (req, res) => {
  const { token } = req.session;

  if (token) {
    return res.redirect('/me');
  }

  res.render('login');
});

// Handle login form submission
router.post('/login', async (req, res) => {
  const { email } = req.body;

  const tenant = email.split('@')[1];

  const { redirect_url } = await oauthController.authorize({
    tenant,
    product,
    redirect_uri: defaultRedirectUrl,
    state: 'some-random-state',
  });

  return res.redirect(redirect_url);
});

// Handle the SAML Response from IdP
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

  const { access_token } = await oauthController.token(body);

  const profile = await oauthController.userInfo(access_token);
  const user = (await getUserByEmail(profile.email)) || (await createUser(profile));

  req.session.token = generateJWT(user);

  return res.redirect('/me');
});

// Get the user profile
router.get('/me', async (req, res, next) => {
  const { token } = req.session;

  if (!token) {
    return redirectIfNotAuthenticated(req, res);
  }

  const profile = decodeJwt(token);

  res.render('me', { profile });
});

// Fetch users via Hasura GraphQL API
router.get('/hasura', async (req, res, next) => {
  const { token } = req.session;

  if (!token) {
    return redirectIfNotAuthenticated(req, res);
  }

  const users = await getUsers(token);

  res.render('hasura', { users });
});

module.exports = router;
