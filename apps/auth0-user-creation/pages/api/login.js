import fetch from 'node-fetch';
import { withIronSessionApiRoute } from 'iron-session/next';
import { JACKSON_URL } from 'lib/constants';
import auth0Client from 'lib/auth0Client';

async function loginRoute(req, res) {
  const { access_token } = req.query;

  try {
    const response = await fetch(`${JACKSON_URL}/api/oauth/userinfo?access_token=` + access_token);
    const data = await response.json();
    if (response.ok) {
      auth0Client.updateUser(
        { id: `auth0|${data.id}` },
        {
          email: data.email,
          connection: process.env.AUTH0_CONNECTION,
          name: data.firstName,
        },
        function cb(err, user) {
          if (err) {
            if (err.statusCode === 404) {
              console.log(`User not found ... Creating user`);
              auth0Client.createUser(
                {
                  user_id: data.id,
                  email: data.email,
                  connection: process.env.AUTH0_CONNECTION,
                  name: data.firstName,
                  password: '$dummy123L',
                },
                function cb(err, user) {
                  if (err) {
                    console.log(`User creation failed`);
                    console.log(err.statusCode, err.message);
                  } else {
                    console.log(`created user successfully`, user);
                  }
                }
              );
            } else {
              console.log(`User updation failed`);
              console.log(err.statusCode, err.message);
            }
          } else {
            console.log(`updated user successfully`);
            console.log(user);
          }
        }
      );
    }

    req.session.user = data.email;
    await req.session.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default withIronSessionApiRoute(loginRoute, {
  cookieName: 'myapp_cookiename',
  password: 'complex_password_at_least_32_characters_long',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
