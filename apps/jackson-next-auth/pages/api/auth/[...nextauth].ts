import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import BoxyHQSAMLProvider from "next-auth/providers/boxyhq-saml"

const samlLoginUrl =
  process.env.BOXYHQ_SAML_JACKSON_URL || "http://localhost:5225"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    BoxyHQSAMLProvider({
      issuer: samlLoginUrl,
      clientId: `tenant=boxyhq.com&product=${
        process.env.BOXYHQ_PRODUCT || "next-auth-demo"
      }`,
      clientSecret: "dummy",
    }),
    CredentialsProvider({
      id: "boxyhq-idp",
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "IdP Login",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        code: {
          label: "Code: Go to https://mocksaml.com/saml/login to initiate SAML IdP login",
          type: "text",
          placeholder: "Enter code",
        },
      },
      async authorize(credentials, req) {
        const { code } = credentials || {}

        if (!code) {
          return null
        }

        const res = await fetch(`${samlLoginUrl}/api/oauth/token`, {
          method: "POST",
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: "dummy",
            client_secret: "dummy",
            redirect_url: process.env.NEXTAUTH_URL,
            code,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (res.status !== 200) {
          return null
        }

        const json = await res.json()
        if (!json?.access_token) {
          return null
        }

        const resUserInfo = await fetch(`${samlLoginUrl}/api/oauth/userinfo`, {
          headers: {
            Authorization: `Bearer ${json.access_token}`,
          },
        })

        if (resUserInfo.status !== 200) {
          return null
        }
        const profile = await resUserInfo.json()

        if (profile?.id && profile?.email) {
          return {
            id: profile.id,
            email: profile.email,
            name: [profile.firstName, profile.lastName]
              .filter(Boolean)
              .join(" "),
            image: null,
          }
        }

        return null
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
})
