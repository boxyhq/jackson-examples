import jackson from '@boxyhq/saml-jackson';
import type { IAPIController, IOAuthController, JacksonOption, DirectorySync } from '@boxyhq/saml-jackson';

const opts: JacksonOption = {
  externalUrl: `${process.env.APP_URL}`,
  samlPath: '/',
  scimPath: '/api/scim',
  db: {
    engine: 'sql',
    type: 'postgres',
    url: process.env.DATABASE_URL,
  },
};

let apiController: IAPIController;
let oauthController: IOAuthController;
let directorySync: DirectorySync;

const g = global as any;

export default async function init() {
  if (!g.apiController || !g.oauthController) {
    const ret = await jackson(opts);

    apiController = ret.apiController;
    oauthController = ret.oauthController;
    directorySync = ret.directorySync;

    g.apiController = apiController;
    g.oauthController = oauthController;
    g.directorySync = directorySync;
  } else {
    apiController = g.apiController;
    oauthController = g.oauthController;
    directorySync = g.directorySync;
  }

  return {
    apiController,
    oauthController,
    directorySync,
  };
}
