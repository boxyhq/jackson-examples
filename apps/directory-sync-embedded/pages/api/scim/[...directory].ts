import type { NextApiRequest, NextApiResponse } from 'next';
import type { DirectorySyncRequest, HTTPMethod, DirectorySyncEvent } from '@boxyhq/saml-jackson';
import jackson from '../../../lib/jackson';
import { extractAuthToken } from '../../../lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { directorySync } = await jackson();

  const { method, query, body } = req;

  const directory = query.directory as string[];

  const [directoryId, path, resourceId] = directory;

  // Handle the SCIM API requests
  const request: DirectorySyncRequest = {
    method: method as HTTPMethod,
    body: body ? JSON.parse(body) : undefined,
    directoryId,
    resourceId,
    resourceType: path === 'Users' ? 'users' : 'groups',
    apiSecret: extractAuthToken(req),
    query: {
      count: req.query.count ? parseInt(req.query.count as string) : undefined,
      startIndex: req.query.startIndex ? parseInt(req.query.startIndex as string) : undefined,
      filter: req.query.filter as string,
    },
  };

  const { status, data } = await directorySync.requests.handle(request, async (event: DirectorySyncEvent) => {
    console.log(event); // Do something with the event
  });

  return res.status(status).json(data);
}
