import fetch from 'node-fetch';
import 'lib/firebaseClient'; // Initializes the Firebase SDK
import { getAuth } from 'firebase-admin/auth';
import { JACKSON_URL } from 'lib/constants';
import generatePassword from 'lib/generatePassword';

async function loginRoute(req, res) {
  const { access_token } = req.query;

  try {
    const response = await fetch(`${JACKSON_URL}/api/oauth/userinfo?access_token=` + access_token);
    const data = await response.json();
    const uid = data.id;
    if (response.ok) {
      const userCreationTask = getAuth()
        .updateUser(uid, {
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
            return getAuth()
              .createUser({
                uid: uid,
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
      await userCreationTask;
      const token = await getAuth().createCustomToken(uid);
      res.json({ token });
      return;
    }

    // req.session.user = data.email;
    // await req.session.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
