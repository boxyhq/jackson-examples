import styles from './access-denied.module.css';
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <>
      <h1>Access Denied</h1>
      <p>
        You must be signed in to view this page. Click on &quot;Sign in with SAML SSO&quot; above to begin the
        SAML login flow using SAML Jackson and NextAuth.js. This uses the OAuth 2.0 flow.
        <br />
        <br />
        To test the OIDC flow click on the link below instead:
      </p>
      <Link href='/oidc' className={styles.link} data-test-id='signInButtonOIDC'>
        Sign in with SSO (OIDC proxy)
      </Link>
    </>
  );
}
