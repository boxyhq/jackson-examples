import type { Directory } from '@boxyhq/saml-jackson';
import jackson from './jackson';

// Find or create a directory sync connection for the given tenant and product.
export const findOrCreateDirectory = async (tenant: string, product: string): Promise<Directory> => {
  const { directorySync } = await jackson();

  const { data: directories } = await directorySync.directories.getByTenantAndProduct(tenant, product);

  if (directories && directories.length > 0) {
    return directories[0];
  }

  const { data: directoryCreated, error } = await directorySync.directories.create({
    name: `Directory Sync : ${tenant}`,
    type: 'okta-scim-v2',
    tenant,
    product,
  });

  if (error) {
    throw error;
  }

  if (!directoryCreated) {
    throw new Error('Could not create directory sync connection');
  }

  return directoryCreated;
};
