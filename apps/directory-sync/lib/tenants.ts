import prisma from './prisma';

const tenants = {
  get: async (tenant: string) => {
    return await prisma.tenant.findUnique({
      where: {
        domain: tenant,
      },
    });
  },
};

export default tenants;
