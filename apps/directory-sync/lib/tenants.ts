import prisma from './prisma';

const tenants = {
  get: async (tenant: string) => {
    return await prisma.tenant.findUnique({
      where: {
        domain: tenant,
      },
    });
  },

  getFirst: async () => {
    return await prisma.tenant.findFirst();
  },
};

export default tenants;
