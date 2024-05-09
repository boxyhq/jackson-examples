import type { SAMLJackson, JacksonOption } from '@boxyhq/saml-jackson';

import jackson from '@boxyhq/saml-jackson';

const opts: JacksonOption = {
  idpEnabled: true,
  preLoadedConnection: './pre-loaded',
  externalUrl: `${process.env.NEXTAUTH_URL}`,
  samlPath: '/api/oauth/saml',
  db: {
    engine: 'mem',
  },
};

const g = global as any;

export default async function init() {
  if (!g.jacksonInstance) {
    g.jacksonInstance = await jackson(opts);
  }

  return g.jacksonInstance as SAMLJackson;
}
