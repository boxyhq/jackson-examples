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
      // If no group found in raw, assume user
      if (profile) {
        const raw = profile.raw as any;

        token['role'] = 'group' in raw ? raw.group : defaultRole;
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
