import type { GetServerSideProps } from 'next';
import Container from '../components/Container';
import prisma from '../lib/prisma';
import { Group } from '../types';
import tenants from '../lib/tenants';

export default function Groups(props: { groups: Group[] }) {
  const { groups } = props;

  return (
    <Container title='Groups'>
      <div className='space-y-4'>
        <h2 className='mb-5 text-2xl'>Groups ({groups.length})</h2>
      </div>
      <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Tenant
            </th>
            <th scope='col' className='px-6 py-3'>
              Group ID
            </th>
            <th scope='col' className='px-6 py-3'>
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            return (
              <tr
                key={group.id}
                className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
                <td className='px-6 py-4'>{group.tenant.domain}</td>
                <td className='px-6 py-4'>{group.directoryGroupId}</td>
                <td className='px-6 py-4'>{group.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tenant = await tenants.getFirst();

  const groups = await prisma.group.findMany({
    where: {
      tenantId: tenant?.id,
    },
    include: { tenant: true },
  });

  return {
    props: {
      groups,
    },
  };
};
