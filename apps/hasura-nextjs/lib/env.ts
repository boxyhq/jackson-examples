export const env = {
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET || 'secret',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3366',
  },
  jackson: {
    endpoint: process.env.BOXYHQ_SAML_JACKSON_URL || 'https://jackson-demo.boxyhq.com',
    product: process.env.BOXYHQ_PRODUCT || 'saml-demo.boxyhq.com',
  },
  hasura: {
    endpoint: process.env.HASURA_ENDPOINT || 'http://localhost:8081/v1/graphql',
    adminSecret: process.env.HASURA_ADMIN_SECRET || 'secret',
    secret: process.env.HASURA_JWT_SECRET || 'secret',
  },
};
