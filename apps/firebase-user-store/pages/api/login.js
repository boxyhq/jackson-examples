import fetch from 'node-fetch';
import { withIronSessionApiRoute } from 'iron-session/next';
import 'lib/firebaseClient'; // Initializes the Firebase SDK
import { getAuth } from 'firebase-admin/auth';
import { JACKSON_URL } from 'lib/constants';
import generatePassword from 'lib/generatePassword';

async function loginRoute(req, res) {
  const { access_token } = req.query;

  try {
    const response = await fetch(`${JACKSON_URL}/api/oauth/userinfo?access_token=` + access_token);
    const data = await response.json();
    if (response.ok) {
      getAuth()
        .updateUser(data.id, {
          email: data.email,
          displayName: data.firstName,
        })
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully updated user', userRecord.toJSON());
        })
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            console.log(`User not found ... Creating user`);
            getAuth()
              .createUser({
                uid: data.id,
                email: data.email,
                displayName: data.firstName,
                password: generatePassword(12),
              })
              .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log('Successfully created new user:', userRecord.uid);
              })
              .catch((error) => {
                console.log('Error creating new user:', error);
              });
          } else {
            console.log(`User updation failed`);
            console.log(err.code);
          }
          console.log('Error updating user:', error);
        });
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
