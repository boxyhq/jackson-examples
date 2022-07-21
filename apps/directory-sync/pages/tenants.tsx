import type { GetServerSideProps } from 'next';
import Container from '../components/Container';
import prisma from '../lib/prisma';
import { Tenant } from '../types';

export default function Groups(props: { tenants: Tenant[] }) {
  const { tenants } = props;

  return (
    <Container title='Groups'>
      <div className='space-y-4'>
        <h2 className='mb-5 text-2xl'>Tenants ({tenants.length})</h2>
      </div>
      <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Id
            </th>
            <th scope='col' className='px-6 py-3'>
              Domain
            </th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => {
            return (
              <tr
                key={tenant.id}
                className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
                <td className='px-6 py-4'>{tenant.id}</td>
                <td className='px-6 py-4'>{tenant.domain}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tenants = await prisma.tenant.findMany({});

  return {
    props: {
      tenants,
    },
  };
};
