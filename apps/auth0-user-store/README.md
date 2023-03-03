# SAML Jackson + Auth0 User store

This demo shows how to login with Auth0 using SAML Jackson Generic Connection. Users will be automatically mapped to the Auth0 user store.

## Setup

### Jackson - Setup SAML configuration

For the demo, we can use mocksaml.com (mock SAML IdP) to test the flow. Add a config in Jackson with the following settings.

- tenant: boxyhq.com
- product: saml-demo.auth0.com
- Allowed redirect URLs: https://<YOUR_AUTH0_TENANT_FROM_DASHBOARD>.auth0.com
- Default redirect URL: https://<YOUR_AUTH0_TENANT_FROM_DASHBOARD>.auth0.com/login/callback
- Raw IdP XML: Can be downloaded from [mocksaml.com](mocksaml.com)

### Auth0 - Setup Connection and Application

1. Create [Custom Connection](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers/oauth2) under `Authentication` -> `Social` tab. While configuring the connection,

   - Point the Authorization and Token URL to a hosted endpoint for Jackson.
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

2. Create an Application under `Applications` -> `Applications` and set the Allowed Callback URLs to point to `http://localhost:3366/profile` along with Allowed Logout URLs to `http://localhost:3366`. Also enable the connection created in the previous step. Use the clientId of the application for configuration as mentioned below.

### App - Pass tenant/product to Jackson

Since SAML is multi-tenanted we need to pass the tenant/product information to Jackson. Auth0 supports passing of [parameters to Identity Providers](https://auth0.com/docs/authenticate/identity-providers/pass-parameters-to-idps), although only a limited set of params are allowed. We use `resource` param to pass the encoded tenant info:

```jsx
<Auth0Provider {...providerConfig} resource={`tenant=${tenant}&product=saml-demo.boxyhq.com`}>
```

## Configuration

### Configure credentials

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, first copy `.env.local.example` into a new file in the root folder called `.env.local`, and replace the values with your own Auth0 Application client ID and Auth0 domain.

```sh
REACT_APP_AUTH0_DOMAIN={YOUR_AUTH0_DOMAIN}
REACT_APP_AUTH0_CLIENTID={YOUR_AUTH0_CLIENTID}
```

## Run the sample

Use `npm` to install the project dependencies:

```bash
npm install // from root of monorepo
```

This compiles and serves the React app and starts the backend API server on port 3366.

```bash
npm run dev:auth0-user-store // from root of monorepo
```
## Contributing

Thanks for taking the time to contribute! Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are appreciated.

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

## Community

- [Discord](https://discord.gg/uyb7pYt4Pa) (For live discussion with the Community and BoxyHQ team)
- [Twitter](https://twitter.com/BoxyHQ) (Get the news fast)
