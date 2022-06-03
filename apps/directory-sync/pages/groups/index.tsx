import type { GetServerSideProps } from "next";
import Container from "../../components/Container";
import prisma from "../../lib/prisma";
import { Group } from "../../types";

export default function Groups(props: { groups: Group[] }) {
  const { groups } = props;

  return (
    <Container title="Groups">
      <div className="space-y-4">
        <h2 className="text-2xl">Groups</h2>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Tenant
            </th>
            <th scope="col" className="px-6 py-3">
              Group ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            return (
              <tr key={group.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4">{group.tenant.domain}</td>
                <td className="px-6 py-4">{group.directoryGroupId}</td>
                <td className="px-6 py-4">{group.name}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const groups = await prisma.group.findMany({
    where: {
      tenantId: 1,
    },
    include: { tenant: true },
  });

  return {
    props: {
      groups,
    },
  }
}