import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import BoxyHQSAMLProvider from 'next-auth/providers/boxyhq-saml';
import jackson from '../../../lib/jackson';

const samlLoginUrl = process.env.NEXTAUTH_URL;

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    // OAuth flow
    BoxyHQSAMLProvider({
      authorization: { params: { scope: '' } },
      issuer: samlLoginUrl,
      clientId: 'dummy',
      clientSecret: 'dummy',
    }),
    CredentialsProvider({
      id: 'boxyhq-idp',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'IdP Login',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        code: {
          label: 'Code: Go to https://mocksaml.com/saml/login to initiate SAML IdP login',
          type: 'text',
          placeholder: 'Enter code',
        },
      },
      async authorize(credentials, req) {
        const { code } = credentials || {};

        if (!code) {
          return null;
        }

        const { oauthController } = await jackson();
        const result = await oauthController.token({
          grant_type: 'authorization_code',
          client_id: 'dummy',
          client_secret: 'dummy',
          redirect_uri: process.env.NEXTAUTH_URL,
          code,
        });

        if (!result?.access_token) {
          return null;
        }

        const profile = await oauthController.userInfo(result.access_token);

        if (profile?.id && profile?.email) {
          return {
            id: profile.id,
            email: profile.email,
            name: [profile.firstName, profile.lastName].filter(Boolean).join(' '),
            image: null,
          };
        }

        return null;
      },
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = 'admin';
      return token;
    },
  },
};

export default NextAuth(authOptions);
