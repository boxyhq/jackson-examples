import type { NextApiRequest, NextApiResponse } from 'next';
import users from '../../lib/users';
import groups from '../../lib/groups';
import memberships from '../../lib/memberships';
import tenants from '../../lib/tenants';
import { addLog } from '../../lib/log';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  handleDirectorySyncEvents(req);

  return res.status(200).end();
}

const handleDirectorySyncEvents = async (req: NextApiRequest) => {
  const { body } = req;
  const { event, data, tenant } = body;

  // TODO: Verify the webhook secret
  // TODO: Verify the signature "BoxyHQ-Signature"

  const tenantInfo = await tenants.get(tenant);

  // Tenant not found
  if (tenantInfo === null) {
    return;
  }

  // Log the webhook events
  addLog(tenantInfo.id, event, data);

  // Users events
  if (event === 'user.created') {
    return await users.create(tenantInfo.id, data);
  }

  if (event === 'user.updated') {
    return await users.update(data);
  }

  if (event === 'user.deleted') {
    return await users.delete(data.id);
  }

  // Groups events
  if (event === 'group.created') {
    return await groups.create(tenantInfo.id, data);
  }

  if (event === 'group.updated') {
    return await groups.update(data);
  }

  if (event === 'group.deleted') {
    return await groups.delete(data.id);
  }

  // Group membership events
  if (event === 'group.user_added') {
    const {
      id: directoryUserId,
      group: { id: directoryGroupId },
    } = data;

    return await memberships.add(directoryGroupId, directoryUserId);
  }

  if (event === 'group.user_removed') {
    const {
      id: directoryUserId,
      group: { id: directoryGroupId },
    } = data;

    return await memberships.remove(directoryGroupId, directoryUserId);
  }

  return;
};
