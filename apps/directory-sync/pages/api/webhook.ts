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
    return await createUser(tenantInfo.id, data);
  }

  if (event === 'user.updated') {
    return await updateUser(data);
  }

  if (event === 'user.deleted') {
    return await deleteUser(data);
  }
};

const getTenantInfo = async (tenant: string) => {
  return await prisma.tenant.findUnique({
    where: {
      domain: tenant,
    },
  });
};

const createUser = async (tenantId: number, data: any) => {
  return await prisma.user.create({
    data: {
      tenantId,
      directoryUserId: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
    },
  });
};

const updateUser = async (data: any) => {
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
};

const deleteUser = async (data: any) => {
  return await prisma.user.delete({
    where: {
      directoryUserId: data.id,
    },
  });
};
