import type { GetServerSideProps } from 'next';
import Container from '../components/Container';
import prisma from '../lib/prisma';
import { Log } from '../types';
import tenants from '../lib/tenants';

export default function Logs(props: { logs: Log[] }) {
  const { logs } = props;

  return (
    <Container title='Webhook Events'>
      <div className='space-y-4'>
        <h2 className='mb-5 text-2xl'>Webhook Events</h2>
      </div>
      <table className='table-fixed text-left text-sm text-gray-500 dark:text-gray-400'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Tenant
            </th>
            <th scope='col' className='px-6 py-3'>
              Event
            </th>
            <th scope='col' className='px-6 py-3'>
              Created At
            </th>
            <th scope='col' className='px-6 py-3'>
              Payload
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            return (
              <tr
                key={log.id}
                className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
                <td className='px-6 py-4'>{log.tenant.domain}</td>
                <td className='px-6 py-4'>{log.action}</td>
                <td className='px-6 py-4'>{log.createdAt.toString()}</td>
                <td className='px-6 py-4'>{JSON.stringify(log.payload)}</td>
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

  const logs = await prisma.log.findMany({
    where: {
      tenantId: tenant?.id,
    },
    include: { tenant: true },
    orderBy: { createdAt: 'desc' },
  });

  return {
    props: {
      logs: logs.map((log) => {
        return {
          ...log,
          createdAt: log.createdAt.toISOString(),
        };
      }),
    },
  };
};
