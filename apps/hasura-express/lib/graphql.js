const { GraphQLClient } = require('graphql-request');

const createClient = (token) => {
  return new GraphQLClient(process.env.HASURA_ENDPOINT, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const createAdminClient = () => {
  return new GraphQLClient(process.env.HASURA_ENDPOINT, {
    headers: {
      'x-hasura-admin-secret': 'secret',
    },
  });
};

module.exports = {
  createClient,
  createAdminClient,
};
