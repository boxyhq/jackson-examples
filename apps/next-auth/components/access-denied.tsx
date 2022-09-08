import { signIn } from "next-auth/react"
import styles from "./access-denied.module.css"

export default function AccessDenied() {
  return (
    <>
      <h1>Access Denied</h1>
      <p>
        You must be signed in to view this page. Click on &quot;Sign In&quot;
        above to begin the SAML login flow using SAML Jackson and NextAuth.js.
        This uses the OAuth 2.0 flow.
        <br />
        <br />
        To test the OIDC flow click on the link below instead:
      </p>

      <a
        className={styles.link}
        data-test-id="signInButtonOIDC"
        onClick={(e) => {
          e.preventDefault()
          // OIDC flow
          signIn("boxyhq-saml-oidc")
        }}
      >
        Sign in with SAML SSO (OIDC proxy)
      </a>
    </>
  )
}
