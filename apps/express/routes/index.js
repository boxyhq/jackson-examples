const express = require('express');
const router = express.Router();
const jose = require('jose');

let connectionAPIController;
let oauthController;
let oidcDiscoveryController;

const baseUrl = process.env.APP_URL;
const redirectUrl = process.env.REDIRECT_URL;
const product = 'flex';
const tenant = 'boxyhq';
const defaultRedirectUrl = `${baseUrl}/sso/callback`;
const samlPath = '/api/oauth/saml';
const oidcPath = '/api/oauth/oidc';
const acsUrl = `${baseUrl}${samlPath}`;
const samlAudience = process.env.SAML_AUDIENCE;

/** @type {import('@boxyhq/saml-jackson').JacksonOption} */
const jacksonOptions = {
  externalUrl: baseUrl,
  samlAudience: samlAudience,
  samlPath,
  oidcPath,
  db: {
    engine: 'mongo',
    url: process.env.DB_HOST,
    encryptionKey: process.env.DB_ENCRYPTION_KEY,
  },
  openid: {
    jwsAlg: 'RS256',
    jwtSigningKeys: {
      private: process.env.OPENID_RSA_PRIVATE_KEY,
      public: process.env.OPENID_RSA_PUBLIC_KEY,
    },
  },
};

const strategyChecker = (req) => {
  const isSAML = 'rawMetadata' in req.body || 'encodedRawMetadata' in req.body;
  const isOIDC = 'oidcDiscoveryUrl' in req.body;
  return { isSAML, isOIDC };
};

(async function init() {
  const jackson = await require('@boxyhq/saml-jackson').controllers(jacksonOptions);

  connectionAPIController = jackson.connectionAPIController;
  oauthController = jackson.oauthController;
  oidcDiscoveryController = jackson.oidcDiscoveryController;
})();

// Show form to add Metadata
router.get('/config/create', async (req, res) => {
  res.render('config/create', { acsUrl });
});

// Store the Metadata
router.all('/connections', async (req, res, next) => {
  try {
    if (req.method === 'GET') {
      res.json(await connectionAPIController.getConnections(req.query));
    } else if (req.method === 'POST') {
      const { isSAML, isOIDC } = strategyChecker(req);
      if (isSAML) {
        await connectionAPIController.createSAMLConnection({
          ...req.body,
          defaultRedirectUrl,
          redirectUrl,
          tenant,
          product,
        });
        res.redirect('/');
      } else if (isOIDC) {
        await connectionAPIController.createOIDCConnection({
          ...req.body,
          defaultRedirectUrl,
          redirectUrl,
          tenant,
          product,
        });
        res.redirect('/');
      } else {
        throw { message: 'Missing SSO connection params', statusCode: 400 };
      }
    } else {
      throw { message: 'Method not allowed', statusCode: 405 };
    }
  } catch (err) {
    console.error('connection api error:', err);
    const { message, statusCode = 500 } = err;

    res.status(statusCode).send(message);
  }
});

// Home
router.get('/', async (req, res) => {
  const { idpMetadata, oidcProvider } = (
    await connectionAPIController.getConnections({
      tenant,
      product,
    })
  )?.[0];
  const provider = idpMetadata ? idpMetadata.provider : oidcProvider.provider;
  const authorizeUrl = createAuthorizeUrl(tenant, product, defaultRedirectUrl);
  const openidAuthorizeUrl = createAuthorizeUrl(tenant, product, defaultRedirectUrl, true);

  res.render('index', {
    provider,
    authorizeUrl,
    openidAuthorizeUrl,
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

// Handle the SAML Response from IdP
router.post(samlPath, async (req, res, next) => {
  try {
    const { redirect_url } = await oauthController.samlResponse(req.body);

    res.redirect(redirect_url);
  } catch (err) {
    next(err);
  }
});

//  Handle the OIDC Response from IdP
router.get(oidcPath, async (req, res, next) => {
  try {
    const { redirect_url } = await oauthController.oidcAuthzResponse(req.query);
    if (redirect_url) {
      res.redirect(302, redirect_url);
    }
  } catch (err) {
    next(err);
  }
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

// Callback (Redirect URL)
router.get('/sso/callback', async (req, res, next) => {
  const { code } = req.query;
  console.log(code);
  const body = {
    code,
    client_id: `tenant=${tenant}&product=${product}`,
    client_secret: 'dummy',
    redirect_uri: defaultRedirectUrl,
  };

  try {
    const { access_token, id_token } = await oauthController.token(body);
    req.session.access_token = access_token;
    if (id_token) {
      const JWKS = jose.createRemoteJWKSet(new URL(`${req.protocol}://${req.get('host')}/oauth/jwks`));

      const { payload } = await jose.jwtVerify(id_token, JWKS);
      req.session.id_token = id_token;
      req.session.id_token_claims = payload;
    }
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
    const { id_token_claims } = req.session;
    res.render('me', { profile, id_token_claims });
  } catch (err) {
    next(err);
  }
});

// Create the authorize URL
const createAuthorizeUrl = (tenant, product, defaultRedirectUrl, isOpenId = false) => {
  const url = new URL(`${baseUrl}/sso/authorize`);

  url.searchParams.append('response_type', 'code');
  url.searchParams.append('client_id', `tenant=${tenant}&product=${product}`);
  url.searchParams.append('redirect_uri', defaultRedirectUrl);
  url.searchParams.append('state', 'a-random-state-value');
  if (isOpenId) {
    url.searchParams.append('scope', 'openid');
  }

  return url.href;
};

module.exports = router;
