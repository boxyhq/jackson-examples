import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import jackson, { type OAuthReq } from '@boxyhq/saml-jackson';
import { options, redirectUrl } from '../../../lib/jackson';

const product = 'saml-demo.boxyhq.com';

export default class LoginController {
  public async store({ request, response }: HttpContextContract) {
    const { oauthController } = await jackson(options);

    const tenant = request.input('tenant');

    const { redirect_url } = await oauthController.authorize({
      tenant,
      product,
      state: 'a-random-state-value',
      redirect_uri: redirectUrl,
    } as OAuthReq);

    return response.redirect(redirect_url as string);
  }
}
