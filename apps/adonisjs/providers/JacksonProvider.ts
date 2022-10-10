import { APIController } from '@boxyhq/saml-jackson/dist/controller/api';
import type { ApplicationContract } from '@ioc:Adonis/Core/Application';

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
    this.app.container.singleton('BoxyHQ/Jackson', () => {
      let apiController: APIController | null = null;

      (async function init() {
        const options = {
          externalUrl: 'http://localhost:3333/',
          samlAudience: 'https://saml.boxyhq.com',
          samlPath: '/sso/acs',
          db: {
            engine: 'sql',
            type: 'postgres',
            url: 'postgres://admin:password@localhost:54320/adonis-jackson',
          },
        };

        const jackson = await require('@boxyhq/saml-jackson').default(options);

        apiController = jackson.apiController;
      })();

      // const options = {
      //   externalUrl: "http://localhost:3333/",
      //   samlAudience: "https://saml.boxyhq.com",
      //   samlPath: "/sso/acs",
      //   db: {
      //     engine: "sql",
      //     type: "postgres",
      //     url: "postgres://admin:password@localhost:54320/adonis-jackson",
      //   },
      // };

      // const jackson = await require("@boxyhq/saml-jackson").default(options);

      console.log({ api: apiController });

      return {
        hello: {
          name: 'Kiran',
        },
        apiController,
      };
    });

    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
