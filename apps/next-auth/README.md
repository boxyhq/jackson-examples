# Overview

This is an example application that shows how [`SAML Jackson`](https://github.com/boxyhq/jackson) and `next-auth` is applied to a basic Next.js app.

The deployed version can be found at [`saml-demo.boxyhq.com`](https://saml-demo.boxyhq.com). You can test the full SAML login flow because we utilize our [Mock SAML](https://mocksaml.com/) service to provide a configuration free demo.

## Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/boxyhq/jackson-next-auth.git
cd jackson-next-auth
npm install
```

### 2. Configure your local environment

Copy the .env file in this directory to .env.local (which will be ignored by Git):

```bash
cp .env .env.local
```

Update the `.env` with your own values.

### 4. Start the application

To run your site locally, use:

```bash
npm run dev
```

To run it in production mode, use:

```bash
npm run build
npm run start
```

### 4. Run the SAML Jackson service

Please follow the instruction [here](https://boxyhq.com/docs/jackson/local-development) to run our [SAML Jackson](https://github.com/boxyhq/jackson) service locally.

## License

Apache 2.0
