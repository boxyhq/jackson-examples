# Overview

This is an example application that shows how [`SAML Jackson`](https://github.com/boxyhq/jackson) and `next-auth` is applied to a basic Next.js app.

Jackson supports both `OAuth` and `Open Id connect (OIDC)` flows. You can test out both by passing the appropriate ids - `boxyhq-saml` for OAuth and `boxyhq-saml-oidc` for OIDC in the `signIn` (components/header.tsx) call.

The deployed version can be found at [`saml-demo.boxyhq.com`](https://saml-demo.boxyhq.com). You can test the full SAML login flow because we utilize our [Mock SAML](https://mocksaml.com/) service to provide a configuration free demo.

## Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/boxyhq/jackson-examples.git
npm install
```

### 2. Configure your local environment

Update the `.env` file if needed and modify the env vars with your own values.

### 4. Start the application

To run your site locally, use:

```bash
npm run dev:next-auth
```

To run it in production mode, use:

```bash
npm run build
npm run start
```

### 4. Run the SAML Jackson service

Please follow the instruction [here](https://boxyhq.com/docs/jackson/local-development) to run our [SAML Jackson](https://github.com/boxyhq/jackson) service locally.

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

## License

Apache 2.0
