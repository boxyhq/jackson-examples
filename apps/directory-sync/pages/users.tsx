import type { GetServerSideProps } from "next";
import Container from "../components/Container";
import prisma from "../lib/prisma";
import { User } from "../types";

export default function Users(props: { users: User[] }) {
  const { users } = props;

  return (
    <Container title="Users">
      <div className="space-y-4">
        <h2 className="text-2xl mb-5">Users ({users.length})</h2>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Tenant
            </th>
            <th scope="col" className="px-6 py-3">
              First name
            </th>
            <th scope="col" className="px-6 py-3">
              Last name
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Groups
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4">{user.tenant.domain}</td>
                <td className="px-6 py-4">{user.firstName}</td>
                <td className="px-6 py-4">{user.lastName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.groupName.join(", ")}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany({
    where: {
      tenantId: 1,
    },
    include: { 
      tenant: true, 
      memberships: {
        include: { 
          group: true
        }
      } 
    },
  });

  const formattedUsers = users.map((user) => {
    const groups = user.memberships.map((membership) => {
      return membership.group.name;
    });

    return {
      ...user,
      groupName: groups,
    }
  });

  return {
    props: {
      users: formattedUsers
    },
  }
}