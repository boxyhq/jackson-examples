const { gql } = require('graphql-request');
const graphql = require('../lib/graphql');

const getUsers = async (token) => {
  const { users } = await graphql.createClient(token).request(
    gql`
      query Users {
        users {
          id
          name
          email
          image
          emailVerified
        }
      }
    `
  );

  return users;
};

const createUser = async (profile) => {
  const mutation = gql`
    mutation registerUser($name: String!, $email: String!, $providerAccountId: String!) {
      insert_users_one(object: { name: $name, email: $email, providerAccountId: $providerAccountId }) {
        id
        name
        email
        providerAccountId
      }
    }
  `;

  const user = {
    name: `${profile.firstName} ${profile.lastName}`,
    email: profile.email,
    providerAccountId: profile.id,
  };

  const { insert_users_one } = await graphql.createAdminClient().request(mutation, user);

  return insert_users_one;
};

const getUserByEmail = async (email) => {
  const query = gql`
    query UserByEmail($email: String!) {
      users(where: { email: { _eq: $email } }) {
        id
        name
        email
        image
        emailVerified
      }
    }
  `;

  const { users } = await graphql.createAdminClient().request(query, { email });

  return users.length ? users[0] : null;
};

module.exports = {
  getUsers,
  createUser,
  getUserByEmail,
};
