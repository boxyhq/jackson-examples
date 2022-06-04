import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  handleDirectorySyncEvents(req);

  return res.status(200).end();
}

const handleDirectorySyncEvents = async (req: NextApiRequest) => {
  const { body } = req;
  const { event, data, tenant } = body;

  const tenantInfo = await getTenantInfo(tenant);

  // Tenant not found
  if (tenantInfo === null) {
    return;
  }

  // Log the webhook events
  addLog(tenantInfo.id, event, data);

  // Users events
  if (event === 'user.created') {
    return await user.create(tenantInfo.id, data);
  }

  if (event === 'user.updated') {
    return await user.update(data);
  }

  if (event === 'user.deleted') {
    return await user.delete(data.id);
  }

  // Groups events
  if (event === 'group.created') {
    return await group.create(tenantInfo.id, data);
  }

  if (event === 'group.updated') {
    return await group.update(data);
  }

  if (event === 'group.deleted') {
    return await group.delete(data.id);
  }

  // Group membership events
  if (event === 'group.user_added') {
    const {
      id: directoryUserId,
      group: { id: directoryGroupId },
    } = data;

    return await userGroup.add(directoryGroupId, directoryUserId);
  }

  if (event === 'group.user_removed') {
    const {
      id: directoryUserId,
      group: { id: directoryGroupId },
    } = data;

    return await userGroup.remove(directoryGroupId, directoryUserId);
  }

  return;
};

// Users CRUD
const user = {
  create: async (tenantId: number, data: any) => {
    return await prisma.user.create({
      data: {
        tenantId,
        directoryUserId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
      },
    });
  },

  update: async (data: any) => {
    return await prisma.user.update({
      where: {
        directoryUserId: data.id,
      },
      data: {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
      },
    });
  },

  delete: async (directoryUserId: string) => {
    return await prisma.user.delete({
      where: {
        directoryUserId,
      },
    });
  },
};

// Groups CRUD
const group = {
  create: async (tenantId: number, data: any) => {
    const { id: directoryGroupId, name } = data;

    const group = await prisma.group.create({
      data: {
        tenantId,
        directoryGroupId,
        name,
      },
    });

    const { members } = data.raw;

    for (const member of members) {
      await userGroup.add(directoryGroupId, member.value);
    }

    return group;
  },

  update: async (data: any) => {
    return await prisma.group.update({
      where: {
        directoryGroupId: data.id,
      },
      data: {
        name: data.name,
      },
    });
  },

  delete: async (directoryGroupId: string) => {
    return await prisma.group.delete({
      where: {
        directoryGroupId,
      },
    });
  },
};

// Group membership
const userGroup = {
  // Add a user to a group
  add: async (directoryGroupId: string, directoryUserId: string) => {
    const user = await getUser(directoryUserId);
    const group = await getGroup(directoryGroupId);

    if (user === null || group === null) {
      return;
    }

    return await prisma.userGroup.create({
      data: {
        userId: user.id,
        groupId: group.id,
      },
    });
  },

  // Remove a user from a group
  remove: async (directoryGroupId: string, directoryUserId: string) => {
    const user = await getUser(directoryUserId);
    const group = await getGroup(directoryGroupId);

    if (user === null || group === null) {
      return;
    }

    return await prisma.userGroup.delete({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: group.id,
        },
      },
    });
  },
};

// Add a log entry
const addLog = async (tenantId: number, action: string, payload: any) => {
  return await prisma.log.create({
    data: {
      tenantId,
      action,
      payload,
    },
  });
};

// A helper function to get the user
const getUser = async (directoryUserId: string) => {
  return await prisma.user.findUnique({
    where: {
      directoryUserId,
    },
  });
};

// A helper function to get the group
const getGroup = async (directoryGroupId: string) => {
  return await prisma.group.findUnique({
    where: {
      directoryGroupId,
    },
  });
};

// A helper function to get the tenant info
const getTenantInfo = async (tenant: string) => {
  return await prisma.tenant.findUnique({
    where: {
      domain: tenant,
    },
  });
};
