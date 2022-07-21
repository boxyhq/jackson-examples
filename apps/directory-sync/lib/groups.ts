import prisma from './prisma';
import memberships from './memberships';

const groups = {
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
      await memberships.add(directoryGroupId, member.value);
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

  get: async (directoryGroupId: string) => {
    return await prisma.group.findUnique({
      where: {
        directoryGroupId,
      },
    });
  },
};

export default groups;
