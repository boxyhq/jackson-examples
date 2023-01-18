import jackson from '@boxyhq/saml-jackson';
import type { JacksonOption, IDirectorySyncController } from '@boxyhq/saml-jackson';

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

let directorySync: IDirectorySyncController;

const g = global as any;

export default async function init() {
  if (!g.directorySync) {
    const ret = await jackson(opts);

    directorySync = ret.directorySyncController;
    g.directorySync = directorySync;
  } else {
    directorySync = g.directorySync;
  }

  return {
    directorySync,
  };
}
