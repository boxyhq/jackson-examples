const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fetch = require('cross-fetch');
var { expressjwt } = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');

const app = express();

const jacksonUrl = 'http://localhost:5225';
const jwtSecret = 'complex-jwt-secret';

app.use(
  cors({
    origin: 'http://localhost:3366',
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

expressjwt({
  secret: jwtSecret,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies['sso-token'],
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.delete('/api/logout', async function (req, res) {
  res.clearCookie('sso-token', { httpOnly: true }).status(200).end();
});

app.get('/api/authenticate', async function (req, res, next) {
  const accessToken = req.query.access_token;

  if (!accessToken) {
    throw new Error('Access token not found.');
  }

  const response = await fetch(`${jacksonUrl}/api/oauth/userinfo?access_token=${accessToken}`, {
    method: 'GET',
  });

  const profile = await response.json();

  // Once the user has been retrieved from the Identity Provider,
  // you may determine if the user exists in your application and authenticate the user.
  // If the user does not exist in your application, you will typically create a new record in your database to represent the user.

  const token = jsonwebtoken.sign(
    {
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
    jwtSecret
  );

  res.cookie('sso-token', token, { httpOnly: true });
  console.log(profile);
  res.json(profile);
});

app.get('/api/profile', async function (req, res, next) {
  const token = req.cookies['sso-token'];

  if (!token) {
    return res.status(401).json({ data: null, error: { message: 'Missing JWT' } });
  }

  // You may fetch the user profile from your database using the user id.

  const payload = jsonwebtoken.verify(token, jwtSecret);

  return res.json({ data: payload, error: null });
});

module.exports = app;
