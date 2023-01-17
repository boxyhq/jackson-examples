import type { GetServerSideProps } from 'next';
import Container from '../components/Container';
import { Group } from '../types';
import jackson from '../lib/jackson';
import config from '../lib/constants';

export default function Groups({ groups }: { groups: Group[] }) {
  return (
    <Container title='Groups'>
      <div className='space-y-4'>
        <h2 className='mb-5 text-2xl'>Groups ({groups.length})</h2>
      </div>
      <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Name
            </th>
            <th scope='col' className='px-6 py-3'>
              Raw
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            return (
              <tr
                key={group.id}
                className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
                <td className='px-6 py-4'>{group.name}</td>
                <td className='px-6 py-4'>{group.raw ? JSON.stringify(group.raw) : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { directorySync } = await jackson();

  const tenant = config.tenant;
  const product = config.product;

  const { data: groups } = await directorySync.groups.setTenantAndProduct(tenant, product).list({});

  return {
    props: {
      groups,
    },
  };
};
