# Supabase BoxyHQSAML provider demo

This app demonstrates login via [BoxyHQSAML Provider](https://github.com/supabase/gotrue/pull/478).

# Setup

Run self hosted supabase using https://github.com/supabase/supabase/blob/master/docker/docker-compose.yml.

### Update `docker-compose.yml`

- Point the gotrue instance to a docker image built using https://github.com/boxyhq/gotrue/tree/boxyhqsaml-provider

- Also add the following env for gotrue in docker-compose.yml

  ```yml
  GOTRUE_EXTERNAL_BOXYHQSAML_ENABLED: 'true'
  GOTRUE_EXTERNAL_BOXYHQSAML_CLIENT_ID: 'dummy'
  GOTRUE_EXTERNAL_BOXYHQSAML_SECRET: # Set this to https://boxyhq.com/docs/jackson/deploy/env-variables#client_secret_verifier of hosted jackson instance or use 'dummy' in case you are using https://jackson-demo.boxyhq.com
  GOTRUE_EXTERNAL_BOXYHQSAML_REDIRECT_URI: 'http://localhost:8000/auth/v1/callback' # callback path to gotrue which receives the authorization code from Jackson
  GOTRUE_EXTERNAL_BOXYHQSAML_URL: # Point this to a hosted (https://boxyhq.com/docs/jackson/deploy/service) instance of jackson or use: https://jackson-demo.boxyhq.com
  ```

### Start the app

Run

```bash
npm run dev:supabase // from root folder
```

### Tenant and product

If you are using https://jackson-demo.boxyhq.com then input tenant as `boxyhq.com` in the landing page and set product in [components/Auth.js](components/Auth.js#L14) as `saml-demo.boxyhq.com`.

If you are hosting [Jackson as a service](https://boxyhq.com/docs/jackson/deploy/service) then SAML config can be [added](https://boxyhq.com/docs/jackson/saml-flow#21-saml-add-config-api) for multiple tenant/products as you wish. Allowed redirect url in the config should contain `https://localhost:8000` (service endpoint for kong)
