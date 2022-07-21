import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  DirectorySyncUserRequest,
  DirectorySyncGroupRequest,
  HTTPMethod,
  DirectorySyncEvent,
} from '@boxyhq/saml-jackson';
import jackson from '../../../lib/jackson';
import { extractAuthToken } from '../../../lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { directorySync } = await jackson();

  const { method, query, body } = req;

  const directory = query.directory as string[];

  const [directoryId, path, resourceId] = directory;

  // Validate the SCIM API request token
  if (!(await directorySync.directories.validateAPISecret(directoryId as string, extractAuthToken(req)))) {
    return res.status(401).json({ data: null, error: { message: 'Unauthorized' } });
  }

  // This will be called for each event that is received from the SCIM endpoint
  const callback = (event: DirectorySyncEvent) => {
    // INFO: Do the further business logic here
    console.log(event);
  };

  // Handle requests to /Users
  if (path === 'Users') {
    const request = {
      method: method as HTTPMethod,
      body: body ? JSON.parse(body) : undefined,
      query: {
        directory_id: directoryId,
        user_id: resourceId,
        count: parseInt(req.query.count as string),
        startIndex: parseInt(req.query.startIndex as string),
        filter: req.query.filter as string,
      } as DirectorySyncUserRequest['query'],
    };

    const { status, data } = await directorySync.usersRequest.handle(request, callback);

    return res.status(status).json(data);
  }

  // Handle requests to /Groups
  if (path === 'Groups') {
    const request = {
      method: method as HTTPMethod,
      body: body ? JSON.parse(body) : undefined,
      query: {
        directory_id: directoryId,
        group_id: resourceId,
        count: parseInt(req.query.count as string),
        startIndex: parseInt(req.query.startIndex as string),
        filter: req.query.filter as string,
      } as DirectorySyncGroupRequest['query'],
    };

    const { status, data } = await directorySync.groupsRequest.handle(request, callback);

    return res.status(status).json(data);
  }
}
