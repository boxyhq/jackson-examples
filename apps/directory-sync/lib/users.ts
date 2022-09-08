import prisma from './prisma';

const users = {
  create: async (tenantId: number, data: any) => {
    return await prisma.user.create({
      data: {
        tenantId,
        directoryUserId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        active: data.active,
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
        active: data.active,
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

  get: async (directoryUserId: string) => {
    return await prisma.user.findUnique({
      where: {
        directoryUserId,
      },
    });
  },
};

export default users;
