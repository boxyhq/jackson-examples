import type { GetServerSideProps } from "next";
import Container from "../components/Container";
import prisma from "../lib/prisma";
import { Log } from "../types";

export default function Logs(props: { logs: Log[] }) {
  const { logs } = props;

  return (
    <Container title="Webhook Events">
      <div className="space-y-4">
        <h2 className="text-2xl mb-5">Webhook Events</h2>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Tenant
            </th>
            <th scope="col" className="px-6 py-3">
              Event
            </th>
            <th scope="col" className="px-6 py-3">
              Created At
            </th>
            <th scope="col" className="px-6 py-3">
              Payload
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            return (
              <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4">{log.tenant.domain}</td>
                <td className="px-6 py-4">{log.action}</td>
                <td className="px-6 py-4">{log.createdAt}</td>
                <td className="px-6 py-4"><pre>{JSON.stringify(log.payload)}</pre></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const logs = await prisma.log.findMany({
    where: {
      tenantId: 1,
    },
    include: { tenant: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    props: {
      logs: logs.map((log) => {
        return {
          ...log,
          createdAt: log.createdAt.toISOString(),
        };
      })
    },
  }
}