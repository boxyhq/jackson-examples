import type { NextApiRequest, NextApiResponse } from 'next';
import type { DirectorySyncUserRequest, DirectorySyncGroupRequest, HTTPMethod } from '@boxyhq/saml-jackson';
import jackson from '../../../lib/jackson';
import { parseQuery, extractAuthToken } from '../../../lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { directorySync } = await jackson();

  const { query, body } = req;

  const method = req.method as string;
  const path = query.path as string[];
  const [directoryId, endpoint, resourceId] = path;

  // Get the directory connection for the given directoryId
  const { data: directory, error } = await directorySync.directories.get(directoryId);

  if (!directory || error) {
    return res.status(404).send('Directory not found');
  }

  // Validate the SCIM secret token
  if (!(await directorySync.directories.validateAPISecret(directory?.id, extractAuthToken(req)))) {
    return res.status(401).send('Unauthorized');
  }

  // Path: /api/scim/{directoryId}/User/{userId}
  // Handle user requests
  if (endpoint === 'Users') {
    const query: DirectorySyncUserRequest['query'] = {
      directory_id: directoryId,
      user_id: resourceId,
      ...parseQuery(req.query),
    };

    const { data, status } = await directorySync.usersRequest.handle({
      method: method as HTTPMethod,
      body: body ? JSON.parse(body) : undefined,
      query,
    });

    return res.status(status).json(data);
  }

  // Path: /api/scim/{directoryId}/Group/{groupId}
  // Handle group requests
  if (endpoint === 'Groups') {
    const query: DirectorySyncGroupRequest['query'] = {
      directory_id: directoryId,
      group_id: resourceId,
      ...parseQuery(req.query),
    };

    const { data, status } = await directorySync.groupsRequest.handle({
      method: method as HTTPMethod,
      body: body ? JSON.parse(body) : undefined,
      query,
    });

    return res.status(status).json(data);
  }
}
