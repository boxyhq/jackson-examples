import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { env } from './env';

const extractDomain = (email: string): string => {
  return email.split('@')[1];
};

const apolloClient = ({ token }: { token: string }) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: env.hasura.endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
        //"x-hasura-admin-secret": "secret",
      },
    }),
    cache: new InMemoryCache(),
  });
};

export { extractDomain, apolloClient };
