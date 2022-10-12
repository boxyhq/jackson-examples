import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class ProfileController {
  public async index({ auth, view }: HttpContextContract) {
    return await view.render('profile', { user: auth.user?.$attributes });
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout();

    return response.redirect('/login');
  }
}
