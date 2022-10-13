const express = require('express');
const jose = require('jose');

const { options, product, redirectUrl, samlPath } = require('../jackson');

const router = express.Router();

let apiController;
let oauthController;
let oidcDiscoveryController;

const tenant = 'boxyhq.com';

(async function init() {
  const jackson = await require('@boxyhq/saml-jackson').controllers(options);

  apiController = jackson.connectionAPIController;
  oauthController = jackson.oauthController;
  oidcDiscoveryController = jackson.oidcDiscoveryController;
})();

// Home
router.get('/', async (req, res) => {
  return res.render('index');
});

// Show form to add Metadata
router.get('/settings', async (req, res, next) => {
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
router.post('/settings', async (req, res, next) => {
  const { rawMetadata } = req.body;

  try {
    // Create SAML SSO connection
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

// SSO Login
router.get('/sso', async (req, res, next) => {
  res.render('login');
});

router.post('/sso', async (req, res, next) => {
  const { tenant } = req.body;

  try {
    const { redirect_url } = await oauthController.authorize({
      tenant,
      product,
      state: 'a-random-state-value',
      redirect_uri: redirectUrl,
    });

    res.redirect(redirect_url);
  } catch (err) {
    next(err);
  }
});

// Handle the SAML Response from Idp
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

  try {
    const { access_token, id_token } = await oauthController.token({
      code,
      client_id: `tenant=${tenant}&product=${product}`,
      client_secret: 'dummy',
      redirect_uri: redirectUrl,
    });

    // Get the profile infor using the access_token
    const { id, email, firstName, lastName } = await oauthController.userInfo(access_token);

    req.session.profile = { id, email, firstName, lastName };

    // if (id_token) {
    //   const JWKS = jose.createRemoteJWKSet(new URL(`${req.protocol}://${req.get('host')}/oauth/jwks`));

    //   const { payload } = await jose.jwtVerify(id_token, JWKS);
    //   req.session.id_token = id_token;
    //   req.session.id_token_claims = payload;
    // }
    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
});

// Display the user profile
router.get('/profile', async (req, res, next) => {
  const { profile } = req.session;

  if (profile === undefined) {
    return res.redirect('/sso');
  }

  res.render('profile', { profile });
});

// OIDC discovery
router.get('/.well-known/openid-configuration', async (req, res, next) => {
  try {
    const config = oidcDiscoveryController.openidConfig();
    const response = JSON.stringify(config, null, 2);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/oauth/jwks', async (req, res, next) => {
  try {
    const jwks = await oidcDiscoveryController.jwks();
    const response = JSON.stringify(jwks, null, 2);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
