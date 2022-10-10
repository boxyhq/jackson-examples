/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route';
import ConfigController from 'App/Controllers/Http/ConfigController';
import LoginController from 'App/Controllers/Http/LoginController';
import SSOController from 'App/Controllers/Http/SSOController';
import ProfileController from 'App/Controllers/Http/ProfileController';

Route.group(() => {
  Route.get('/', async (ctx) => {
    return ctx.view.render('index');
  });

  // SAML SSO settings
  Route.get('/settings', async (ctx) => {
    return new ConfigController().index(ctx);
  });

  Route.post('/settings', async (ctx) => {
    return new ConfigController().store(ctx);
  });

  // SAML SSO Login
  Route.get('/login', async (ctx) => {
    return ctx.view.render('login');
  });

  Route.post('/login', async (ctx) => {
    return new LoginController().store(ctx);
  });

  Route.post('/sso/acs', async (ctx) => {
    return new SSOController().acs(ctx);
  });

  Route.get('/sso/callback', async (ctx) => {
    return new SSOController().callback(ctx);
  });
});

Route.group(() => {
  Route.get('/profile', async (ctx) => {
    return new ProfileController().index(ctx);
  });

  Route.get('/logout', async (ctx) => {
    return new ProfileController().logout(ctx);
  });
}).middleware('auth:web');
