import dynamic from 'next/dynamic';

const OAuthComponentWithNoSSR = dynamic(() => import('components/oauth.js'), {
  ssr: false,
});

export default function IndexPage() {
  return (
    <div>
      <OAuthComponentWithNoSSR />
      <br />
      <br />
      This is a demo app to showcase BoxyHQ's SAML integration. It is
      implemented as an OAuth 2.0 flow and can be used with most standard OAuth
      2.0 libraries out there.
    </div>
  );
}
