import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import jackson from '@boxyhq/saml-jackson';
import { options, samlAudience, acsUrl, redirectUrl } from '../../../lib/jackson';

const tenant = 'boxyhq.com';
const product = 'saml-demo.boxyhq.com';

export default class ConfigController {
  public async index({ view }: HttpContextContract) {
    const { apiController } = await jackson(options);

    // Get the SAML SSO Connection
    const connections = await apiController.getConnections({
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
    const { apiController } = await jackson(options);

    const rawMetadata = request.input('rawMetadata');

    // Create SAML SSO Connection
    await apiController.createSAMLConnection({
      defaultRedirectUrl: redirectUrl,
      redirectUrl,
      tenant,
      product,
      rawMetadata,
    });

    return response.redirect().back();
  }
}
