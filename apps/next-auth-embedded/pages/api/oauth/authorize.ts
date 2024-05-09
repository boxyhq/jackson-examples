import { NextApiRequest, NextApiResponse } from 'next';

import jackson from '../../../lib/jackson';
import { OAuthReq } from '@boxyhq/saml-jackson';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      throw { message: 'Method not allowed', statusCode: 405 };
    }

    const { oauthController } = await jackson();
    const requestParams = req.method === 'GET' ? req.query : req.body;
    const { redirect_url, authorize_form } = await oauthController.authorize(
      requestParams as unknown as OAuthReq
    );
    if (redirect_url) {
      res.redirect(302, redirect_url);
    } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(authorize_form);
    }
  } catch (err: any) {
    console.error('authorize error:', err);
    res.redirect(302, '/error');
  }
}
