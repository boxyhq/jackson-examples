# SAML Jackson + Firebase User store

This demo shows the SAML flow with jackson with a user creation step at end. The user is created by invoking the [Firebase admin SDK](https://firebase.google.com/docs/auth/admin/manage-users#create_a_user).

## Setup

To use the Firebase Admin SDK, you'll need the following:

- A Firebase project. Set `NEXT_PUBLIC_FIREBASE_PROJECT` in .env.
- A Firebase Admin SDK service account to communicate with Firebase. This service account is created automatically when you create a Firebase project or add Firebase to a Google Cloud project.
- A configuration file with your service account's credentials. Follow the steps in [SDK Initialization](https://firebase.google.com/docs/admin/setup#initialize-sdk) to obtain the private keys. Create a file under `config` folder: `service_account.json` and paste the keys into the file. Set the path to the file in GOOGLE_APPLICATION_CREDENTIALS env variable.
- An [app registration](https://firebase.google.com/docs/web/setup#register-app) to use the Firebase SDK on client-side. Create a file under `config` folder: `firebase-sdk.json` and paste the configuration into the file.

## Auth flow

Click Sign in -> redirects to Jackson -> Jackson redirect to IdP based on config -> User logs in at IdP/IdP returns the assertion to Jackson -> Jackson redirects to app with the auth code which is then exchanged for a token and user profile -> the profile is used to update the user in firebase if it exists, else creates a new user -> firebase returns a custom token against the user back to app -> app uses the token to sign in and establish session.

## Run the app

`npm run dev`

production:  
`npm run build`  
`npm run start`

## Contributing

Thanks for taking the time to contribute! Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody and are very appreciated.

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

## Community

- [Discord](https://discord.gg/uyb7pYt4Pa) (For live discussion with the Community and BoxyHQ team)
- [Twitter](https://twitter.com/BoxyHQ) (Get the news fast)
