import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await handleDirectorySyncEvents(req);

  res.status(200).end();
}

const handleDirectorySyncEvents = async (req: NextApiRequest) => {
  const { body } = req;
  const { event, data, tenant } = body;

  const tenantInfo = await getTenantInfo(tenant);

  if (tenantInfo === null) {
    return;
  }

  if (event === 'user.created') {
    return await user.create(tenantInfo.id, data);
  }

  if (event === 'user.updated') {
    return await user.update(data.id, data);
  }

  if (event === 'user.deleted') {
    return await user.delete(data.id);
  }

  if (event === 'group.created') {
    return await group.create(tenantInfo.id, data);
  }

  if (event === 'group.deleted') {
    return await group.delete(data.id);
  }

  // if (event === 'group.user_added') {
  //   return await userGroup.add(data);
  // }

  // if (event === 'group.user_removed') {
  //   return await userGroup.remove(data.group.id, data.id);
  // }

  return;
};

const getTenantInfo = async (tenant: string) => {
  return await prisma.tenant.findUnique({
    where: {
      domain: tenant,
    },
  });
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

  update: async (directoryUserId: string, data: any) => {
    return await prisma.user.update({
      where: {
        directoryUserId,
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
    const { members } = data.raw;

    const group = await prisma.group.create({
      data: {
        tenantId,
        directoryGroupId: data.id,
        name: data.name,
      },
    });

    for (const member of members) {
      await userGroup.add(group.directoryGroupId, member.value);
    }

    return group;
  },

  delete: async (directoryGroupId: string) => {
    const group = await prisma.group.findUnique({
      where: {
        directoryGroupId,
      },
    });

    if (group === null) {
      return;
    }

    return await prisma.group.delete({
      where: {
        id: group.id,
      },
    });
  },
};

// Group membership CRUD
const userGroup = {
  add: async (directoryGroupId: string, directoryUserId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        directoryUserId,
      },
    });

    const group = await prisma.group.findUnique({
      where: {
        directoryGroupId,
      },
    });

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

  remove: async (directoryGroupId: string, directoryUserId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        directoryUserId,
      },
    });

    const group = await prisma.group.findUnique({
      where: {
        directoryGroupId,
      },
    });

    if (user === null || group === null) {
      return;
    }

    // return await prisma.userGroup.delete({
    //   where: {
    //     userId_groupId: {
    //       userId: user.id,
    //       groupId: group.id,
    //     }
    //   },
    // });
  },
};
