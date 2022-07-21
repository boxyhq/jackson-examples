import type { GetServerSideProps } from "next";
import Container from "../components/Container";
import { User } from "../types";
import jackson from "../lib/jackson";
import config from "../lib/constants";

export default function Users({ users }: { users: User[] }) {
  return (
    <Container title="Users">
      <div className="space-y-4">
        <h2 className="mb-5 text-2xl">Users ({users.length})</h2>
      </div>
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              First name
            </th>
            <th scope="col" className="px-6 py-3">
              Last name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr
                key={user.id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{user.first_name}</td>
                <td className="px-6 py-4">{user.last_name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.active ? "Active" : "Suspended"}
                </td>
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

  const { data: users } = await directorySync.users
    .setTenantAndProduct(tenant, product)
    .list({});

  return {
    props: {
      users,
    },
  };
};
