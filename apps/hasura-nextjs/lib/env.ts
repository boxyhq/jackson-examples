export const env = {
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET || 'secret',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3366',
  },
  jackson: {
    endpoint: process.env.BOXYHQ_SAML_JACKSON_URL || 'https://sso.eu.boxyhq.com',
    product: process.env.BOXYHQ_PRODUCT || '1eef7782-41d4-4a0a-b450-0857413b4f63',
  },
  hasura: {
    endpoint: process.env.HASURA_ENDPOINT || 'http://localhost:8081/v1/graphql',
    adminSecret: process.env.HASURA_ADMIN_SECRET || 'secret',
    secret: process.env.HASURA_JWT_SECRET || 'secret',
  },
};
