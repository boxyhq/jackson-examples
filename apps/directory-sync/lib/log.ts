import prisma from './prisma';

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

export { addLog };
