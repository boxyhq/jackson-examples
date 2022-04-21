# SAML Jackson + Firebase User store

This demo shows the SAML flow with jackson with a user creation step at end. The user is created by invoking the [Firebase admin SDK](https://firebase.google.com/docs/auth/admin/manage-users#create_a_user).

## Setup

To use the Firebase Admin SDK, you'll need the following:

- A Firebase project. Set `NEXT_PUBLIC_FIREBASE_PROJECT` in env.
- A Firebase Admin SDK service account to communicate with Firebase. This service account is created automatically when you create a Firebase project or add Firebase to a Google Cloud project.
- A configuration file with your service account's credentials. Follow the steps in [SDK Initialization](https://firebase.google.com/docs/admin/setup#initialize-sdk) to obtain the private keys. Create a file under `config` folder: service_account.json and paste the keys into the file. Set the path to the file in GOOGLE_APPLICATION_CREDENTIALS env variable.
- An [app registration](https://firebase.google.com/docs/web/setup#register-app) to use the Firebase SDK on client-side. Create a file under `config` folder: firebase-sdk.json and paste the configuration into the file.

## Auth flow

App redirects to Jackson -> Jackson to Idp -> Idp back to jackson -> Jackson back to our app with auth code which is exchanged for a token -> get user profile -> call Firebase Admin SDK to update user if already exists, else create the user.

## Run the app

`npm run dev`

production:  
`npm run build`  
`npm run start`
