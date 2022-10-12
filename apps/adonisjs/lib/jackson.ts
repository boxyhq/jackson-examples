import { type JacksonOption } from '@boxyhq/saml-jackson';
import Env from '@ioc:Adonis/Core/Env';

export const appUrl = `http://${Env.get('HOST')}:${Env.get('PORT')}`;
export const samlAudience = 'https://saml.boxyhq.com';
export const acsUrl = `${appUrl}/sso/acs`;
export const redirectUrl = `${appUrl}/sso/callback`;

export const options: JacksonOption = {
  externalUrl: appUrl,
  samlAudience,
  samlPath: '/sso/acs',
  db: {
    engine: 'sql',
    type: 'postgres',
    url: 'postgres://admin:password@localhost:54320/adonis-jackson',
  },
};
