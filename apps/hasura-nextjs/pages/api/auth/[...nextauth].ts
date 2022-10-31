import jwt from 'jsonwebtoken';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import BoxyHQSAMLProvider from 'next-auth/providers/boxyhq-saml';
import { HasuraAdapter } from '@skillrecordings/next-auth-hasura-adapter';
import { env } from '../../../lib/env';

export default NextAuth({
  adapter: HasuraAdapter({
    endpoint: env.hasura.endpoint,
    adminSecret: env.hasura.adminSecret,
  }),
  providers: [
    BoxyHQSAMLProvider({
      issuer: env.jackson.endpoint,
      clientId: 'dummy',
      clientSecret: 'dummy',
      authorization: { params: { scope: '' } },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Add the required Hasura claims
    async jwt({ token, profile }) {
      const allowedRoles = ['admin', 'developer'];
      const defaultRole = 'developer';

      // Fetch the group from profile and add it to the claims
      // If no group found in raw, assume defaultRole
      if (profile) {
        const roles = profile.roles as any;
        const groups = profile.groups as any;
        let role;
        if (roles && roles.length > 0) {
          role = roles[0];
        } else if (groups && groups.length > 0) {
          role = groups[0];
        }

        token['role'] = role ?? defaultRole;
      }

      return {
        ...token,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': allowedRoles,
          'x-hasura-default-role': token.role,
          'x-hasura-role': token.role,
          'x-hasura-user-id': token?.sub,
        },
      };
    },

    // Add id and token (jwt) to the session object
    async session({ token, session }) {
      const encodedToken = jwt.sign(token!, env.nextauth.secret, {
        algorithm: 'HS256',
      });

      session.id = token.sub;
      session.token = encodedToken;
      session.role = token.role;

      return session;
    },
  },
  jwt: {
    async encode({ token, secret }) {
      return jwt.sign(token!, secret, { algorithm: 'HS256' });
    },
    async decode({ token, secret }) {
      return jwt.verify(token as string, secret, {
        algorithms: ['HS256'],
      }) as JWT;
    },
  },
});
