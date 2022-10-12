import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { oauthController } from '@ioc:BoxyHQ/Jackson';
import { type OAuthReq } from '@boxyhq/saml-jackson';
import { redirectUrl } from '../../../lib/jackson';

const product = 'saml-demo.boxyhq.com';

export default class LoginController {
  public async store({ request, response }: HttpContextContract) {
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
