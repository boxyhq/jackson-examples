declare module '@ioc:BoxyHQ/Jackson' {
  import { type IOAuthController, type IConnectionAPIController } from '@boxyhq/saml-jackson';

  export const connectionAPIController: IConnectionAPIController;
  export const oauthController: IOAuthController;
}
