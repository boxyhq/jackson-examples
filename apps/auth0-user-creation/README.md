This demo shows the SAML flow with jackson with a user creation step at end. The user is created against an Auth0 Database connection.

## Setup

You'll need an auth0 tenant.

- [Register](https://auth0.com/docs/get-started/auth0-overview/create-applications/machine-to-machine-apps) a Machine-to-Machine app and giving it access to the management API with permissions: `create:users update:users`. Copy the cliend id and secret and set `AUTH0_NON_INTERACTIVE_CLIENT_ID` & `AUTH0_NON_INTERACTIVE_CLIENT_SECRET` env vars.
- Create a Database connection against which we will be creating users. Set `AUTH0_CONNECTION` with the name of the connection.

## Auth flow

App redirects to Jackson -> Jackson to Idp -> Idp back to jackson -> Jackson back to our app with auth code which is exchanged for a token -> get user profile -> call Auth0 Management APIs to update user if already exists else create the user.

## Run the app

`npm run dev`

production:  
`npm run build`  
`npm run start`
