import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { connectionAPIController } from '@ioc:BoxyHQ/Jackson';
import { samlAudience, acsUrl, redirectUrl, tenant, product } from '../../../lib/jackson';

export default class ConfigController {
  public async index({ view }: HttpContextContract) {
    // Get the SAML SSO Connection
    const connections = await connectionAPIController.getConnections({
      tenant,
      product,
    });

    const connection = connections.length > 0 ? connections[0] : null;

    return await view.render('config', {
      connection,
      acsUrl,
      samlAudience,
      tenant,
      product,
      hasConnection: connections.length > 0,
    });
  }

  public async store({ request, response }: HttpContextContract) {
    const rawMetadata = request.input('rawMetadata');

    // Create SAML SSO Connection
    await connectionAPIController.createSAMLConnection({
      defaultRedirectUrl: redirectUrl,
      redirectUrl,
      tenant,
      product,
      rawMetadata,
    });

    return response.redirect().back();
  }
}
