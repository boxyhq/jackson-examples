import { type JacksonOption } from '@boxyhq/saml-jackson';
import Env from '@ioc:Adonis/Core/Env';

export const appUrl = `http://${Env.get('HOST')}:${Env.get('PORT')}`;
export const samlAudience = 'https://saml.boxyhq.com';
export const acsUrl = `${appUrl}/sso/acs`;
export const redirectUrl = `${appUrl}/sso/callback`;

const databaseUrl = `postgres://${Env.get('PG_USER')}:${Env.get('PG_PASSWORD')}@${Env.get(
  'PG_HOST'
)}:${Env.get('PG_PORT')}/${Env.get('PG_DB_NAME')}`;

export const options: JacksonOption = {
  externalUrl: appUrl,
  samlAudience,
  samlPath: '/sso/acs',
  db: {
    engine: 'sql',
    type: 'postgres',
    url: databaseUrl,
  },
};
