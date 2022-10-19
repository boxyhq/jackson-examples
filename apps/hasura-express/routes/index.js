const express = require('express');
const { generateJWT, decodeJwt } = require('../lib/utils');
const { getUsers, createUser, getUserByEmail } = require('../lib/users');
const { options, product, redirectUrl, samlPath } = require('../lib/jackson');

const router = express.Router();

let apiController;
let oauthController;

const tenant = 'boxyhq.com';

(async function init() {
  const jackson = await require('@boxyhq/saml-jackson').controllers(options);

  apiController = jackson.connectionAPIController;
  oauthController = jackson.oauthController;
})();

// Home
router.get('/', async (req, res) => {
  res.render('index');
});

// Show form to add Metadata
router.get('/settings', async (req, res) => {
  try {
    // Get the SAML SSO connection
    const connections = await apiController.getConnections({
      tenant,
      product,
    });

    res.render('settings', {
      hasConnection: connections.length > 0,
    });
  } catch (err) {
    next(err);
  }
});

// Store the Metadata
router.post('/settings', async (req, res) => {
  const { rawMetadata } = req.body;

  try {
    await apiController.createSAMLConnection({
      rawMetadata,
      defaultRedirectUrl: redirectUrl,
      redirectUrl,
      tenant,
      product,
    });

    res.redirect('/settings');
  } catch (err) {
    next(err);
  }
});

// Display login form
router.get('/sso', async (req, res) => {
  res.render('login');
});

// Handle login form submission
router.post('/sso', async (req, res) => {
  const { tenant } = req.body;

  const { redirect_url } = await oauthController.authorize({
    tenant,
    product,
    state: 'a-random-state-value',
    redirect_uri: redirectUrl,
  });

  return res.redirect(redirect_url);
});

// Handle the SAML Response from IdP
router.post(samlPath, async (req, res, next) => {
  const { RelayState, SAMLResponse } = req.body;

  try {
    const { redirect_url } = await oauthController.samlResponse({ RelayState, SAMLResponse });

    res.redirect(redirect_url);
  } catch (err) {
    next(err);
  }
});

// Callback (Redirect URL)
router.get('/sso/callback', async (req, res, next) => {
  const { code, state } = req.query;

  // TODO: Validate state

  const { access_token } = await oauthController.token({
    code,
    client_id: `tenant=${tenant}&product=${product}`,
    client_secret: 'dummy',
    redirect_uri: redirectUrl,
  });

  // Get the profile infor using the access_token
  const profile = await oauthController.userInfo(access_token);

  const user = (await getUserByEmail(profile.email)) || (await createUser(profile));

  req.session.token = generateJWT(user);

  req.session.profile = {
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
  };

  return res.redirect('/profile');
});

// Get the user profile
router.get('/profile', async (req, res, next) => {
  const { token, profile } = req.session;

  if (!token || !profile) {
    return res.redirect('/sso');
  }

  const decodedJwt = decodeJwt(token);

  res.render('profile', { profile, decodedJwt });
});

// Fetch users via Hasura GraphQL API
router.get('/hasura', async (req, res, next) => {
  const { token, profile } = req.session;

  if (!token || !profile) {
    return res.redirect('/sso');
  }

  const users = await getUsers(token);

  res.render('hasura', { users });
});

module.exports = router;
