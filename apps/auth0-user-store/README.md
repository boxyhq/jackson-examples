# SAML Jackson + Auth0 User store

This demo shows how to login with Auth0 using SAML Jackson Generic Connection. Users will be automatically mapped to the Auth0 user store.

## Setup

1. Create [Custom Connection](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers/oauth2) under `Authentication` -> `Social` tab. While configuring the connection,
   - Point the Authorization and Token URL to a hosted endpoint for jackson.
   - You can set the Client ID to `dummy`, while the Client Secret to the Client Secret verifier.
   - Paste the following for the `Fetch User Profile Script`:
     ```javascript
     function fetchUserProfile(accessToken, context, callback) {
       request.get(
         {
           url: 'https://<jackson-hosted-endpoint>/api/oauth/userinfo',
           headers: {
             Authorization: 'Bearer ' + accessToken,
           },
         },
         (err, resp, body) => {
           if (err) {
             return callback(err);
           }
           if (resp.statusCode !== 200) {
             return callback(new Error(body));
           }
           let bodyParsed;
           try {
             bodyParsed = JSON.parse(body);
           } catch (jsonError) {
             return callback(new Error(body));
           }
           const profile = {
             user_id: bodyParsed.id,
             email: bodyParsed.email,
           };
           callback(null, profile);
         }
       );
     }
     ```
2. Create an Application under `Applications` -> `Applications` and set the Allowed Callback URLs to point to `http://localhost:3366`. Also enable the connection created in the previous step. Use the clientId of the application for configuration as mentioned below.

## Configuration

### Configure credentials

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, first copy `src/auth_config.json.example` into a new file in the same folder called `src/auth_config.json`, and replace the values with your own Auth0 application credentials, and optionally the base URLs of your application and API:

```json
{
  "domain": "{YOUR AUTH0 DOMAIN}",
  "clientId": "{YOUR AUTH0 CLIENT ID}"
}
```

## Run the sample

Use `npm` to install the project dependencies:

```bash
npm install
```

This compiles and serves the React app and starts the backend API server on port 3001.

```bash
npm run dev
```
