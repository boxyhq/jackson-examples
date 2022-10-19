import type { ApplicationContract } from '@ioc:Adonis/Core/Application';

import { options } from '../lib/jackson';

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class JacksonProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const jackson = await require('@boxyhq/saml-jackson').default(options);

    this.app.container.singleton('BoxyHQ/Jackson', () => {
      const { connectionAPIController, oauthController } = jackson;

      return {
        connectionAPIController,
        oauthController,
      };
    });
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
