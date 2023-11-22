const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const router = express.Router();

const product = process.env.BOXYHQ_PRODUCT;
const boxyhqUrl = process.env.BOXYHQ_SAML_JACKSON_URL;

const tenant = 'boxyhq.com'; // TODO: Read from request
const clientId = `tenant=${tenant}&product=${product}`;
const clientSecret = 'dummy';

// Register the BoxyHQ SAML strategy
const authClient = new OAuth2Strategy(
  {
    authorizationURL: `${boxyhqUrl}/api/oauth/authorize`,
    tokenURL: `${boxyhqUrl}/api/oauth/token`,
    callbackURL: 'http://localhost:3366/api/auth/callback/boxyhq-saml',
    clientID: clientId,
    clientSecret: clientSecret,
    state: 'some-state-string',
  },
  function (accessToken, refreshToken, profile, cb) {
    console.log('Received profile: ', profile);
    cb(null, profile);
  }
);

// Fetch the user profile
// https://github.com/jaredhanson/passport-oauth2/issues/73
authClient.userProfile = function (accessToken, done) {
  this._oauth2.get(`${boxyhqUrl}/api/oauth/userinfo`, accessToken, function (err, body, res) {
    if (err) {
      return done(err);
    }

    try {
      const { id, email, firstName, lastName, roles, groups } = JSON.parse(body);

      const profile = {
        id,
        email,
        firstName,
        lastName,
        roles,
        groups,
      };

      done(null, profile);
    } catch (e) {
      done(e);
    }
  });
};

passport.use('boxyhq-saml', authClient);

// Serialize the user profile
passport.serializeUser(function (profile, cb) {
  cb(null, profile);
});

// Deserialize the user profile
passport.deserializeUser(function (profile, cb) {
  cb(null, profile);
});

// Make `profile` available in templates
router.use(function (req, res, next) {
  res.locals.profile = req.user;
  next();
});

// Home
router.get('/', async (req, res) => {
  return res.render('index');
});

// SSO Login
router.get('/sso', async (req, res, next) => {
  res.render('login');
});

// Start SSO
router.post('/sso', (req, res, next) => {
  passport.authenticate('boxyhq-saml', {
    successRedirect: '/profile',
    failureRedirect: '/sso',
  })(req, res, next);
});

// Display the user profile
router.get('/profile', async (req, res, next) => {
  if (req.user === undefined) {
    return res.redirect('/sso');
  }

  res.render('profile', { profile: req.user });
});

// Log out
router.get('/logout', async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Callback
router.get(
  '/api/auth/callback/boxyhq-saml',
  passport.authenticate('boxyhq-saml', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/profile');
  }
);

module.exports = router;
