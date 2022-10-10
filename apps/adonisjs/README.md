# SAML Jackson + AdonisJS Example App

This demo app shows how to add SAML SSO to an AdonisJS app using SAML Jackson.

## Setup the app

Please follow the below instructions.

### Install dependencies

```bash
npm install
```

### Setup environment

Update `apps/adonisjs/.env` with your own credentials.

### Run the app

```bash
npm run dev:adonisjs
```

Open the app at [http://localhost:3000](http://localhost:3000)

## Configure SAML SSO

- Open [http://localhost:3000/settings](http://localhost:3000/settings)
- Add the SAML Metadata for the current tenant
