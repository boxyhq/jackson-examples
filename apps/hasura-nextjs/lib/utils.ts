import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const extractDomain = (email: string): string => {
  return email.split('@')[1];
};

const apolloClient = ({ token }: { token: string }) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'http://localhost:8081/v1/graphql',
      headers: {
        Authorization: `Bearer ${token}`,
        //"x-hasura-admin-secret": "secret",
      },
    }),
    cache: new InMemoryCache(),
  });
};

export { extractDomain, apolloClient };
