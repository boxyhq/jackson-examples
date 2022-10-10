import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

import jackson, { type OAuthTokenReqWithCredentials } from '@boxyhq/saml-jackson';
import { options, redirectUrl } from '../../../lib/jackson';

const tenant = 'boxyhq.com';
const product = 'saml-demo.boxyhq.com';

export default class SSOController {
  public async acs({ request, response }: HttpContextContract) {
    const { oauthController } = await jackson(options);

    const relayState = request.input('RelayState');
    const samlResponse = request.input('SAMLResponse');

    const { redirect_url } = await oauthController.samlResponse({
      RelayState: relayState,
      SAMLResponse: samlResponse,
    });

    return response.redirect(redirect_url as string);
  }

  public async callback({ request, response, auth }: HttpContextContract) {
    const { oauthController } = await jackson(options);

    const { code, state } = request.qs();

    // TODO: Validate the returned `state` value.

    // Exchange the code for access_token
    const { access_token } = await oauthController.token({
      code,
      client_id: `tenant=${tenant}&product=${product}`,
      client_secret: 'dummy',
      redirect_uri: redirectUrl,
    } as OAuthTokenReqWithCredentials);

    // Get the profile infor using the access_token
    const { id: providerId, email, firstName, lastName } = await oauthController.userInfo(access_token);

    const user = await User.firstOrCreate(
      { email },
      {
        providerId,
        firstName,
        lastName,
      }
    );

    await auth.loginViaId(user.$attributes.id);

    return response.redirect('/profile');
  }
}
