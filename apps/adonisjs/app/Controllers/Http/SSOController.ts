import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

import { oauthController } from '@ioc:BoxyHQ/Jackson';
import { type OAuthTokenReqWithCredentials } from '@boxyhq/saml-jackson';
import { redirectUrl } from '../../../lib/jackson';

const tenant = 'boxyhq.com';
const product = 'saml-demo.boxyhq.com';

export default class SSOController {
  public async acs({ request, response }: HttpContextContract) {
    const relayState = request.input('RelayState');
    const samlResponse = request.input('SAMLResponse');

    const { redirect_url } = await oauthController.samlResponse({
      RelayState: relayState,
      SAMLResponse: samlResponse,
    });

    return response.redirect(redirect_url as string);
  }

  public async callback({ request, response, auth }: HttpContextContract) {
    const { code, state } = request.qs();

    // TODO: Validate the returned `state` value.

    // Exchange the code for access_token
    const { access_token } = await oauthController.token({
      code,
      client_id: `tenant=${tenant}&product=${product}`,
      client_secret: 'dummy',
      redirect_uri: redirectUrl,
    } as OAuthTokenReqWithCredentials);

    // Get the profile info using the access_token
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
