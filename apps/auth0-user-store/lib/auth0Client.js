import { ManagementClient } from 'auth0';

const auth0Client = new ManagementClient({
  domain: `${process.env.AUTH0_ACCOUNT}.auth0.com`,
  clientId: process.env.AUTH0_NON_INTERACTIVE_CLIENT_ID,
  clientSecret: process.env.AUTH0_NON_INTERACTIVE_CLIENT_SECRET,
  scope: 'create:users update:users',
});

export default auth0Client;
