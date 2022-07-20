import type { Directory } from '@boxyhq/saml-jackson';
import jackson from './jackson';

// Find or create a directory sync connection for the given tenant and product.
const findOrCreateDirectory = async (tenant: string, product: string): Promise<Directory> => {
  const { directorySync } = await jackson();

  let directory: Directory | null = null;

  // Get the directory sync connection for the tenant
  const response = await directorySync.directories.getByTenantAndProduct(tenant, product);

  directory = response.data;

  // Create the directory sync connection for the tenant if it doesn't exist
  if (!directory) {
    const response = await directorySync.directories.create({
      name: `Directory Sync : ${tenant}`,
      type: 'okta-scim-v2',
      tenant,
      product,
    });

    directory = response.data;
  }

  if (!directory) {
    throw new Error('Could not create directory sync connection');
  }

  return directory;
};

export { findOrCreateDirectory };
