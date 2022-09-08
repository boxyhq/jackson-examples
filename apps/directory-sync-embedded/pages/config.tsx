import type { GetServerSideProps } from "next";
import type { Directory } from "@boxyhq/saml-jackson";
import Container from "../components/Container";
import config from "../lib/constants";
import { findOrCreateDirectory } from "../lib/directory";

export default function Config({ directory }: { directory: Directory }) {
  return (
    <Container title="Create Directory Sync Connections">
      <div className="space-y-4">
        <h2 className="mb-5 text-2xl">Configure Directory Sync</h2>
        <table className="w-full text-sm text-gray-800">
          <tbody>
            <tr>
              <td className="uppercase">Directory ID</td>
              <td>{directory.id}</td>
            </tr>
            <tr>
              <td className="uppercase py-4">Name</td>
              <td>{directory.name}</td>
            </tr>
            <tr>
              <td className="uppercase">Tenant</td>
              <td>{directory.tenant}</td>
            </tr>
            <tr>
              <td className="uppercase py-4">Product</td>
              <td>{directory.product}</td>
            </tr>
            <tr>
              <td className="uppercase">SCIM Endpoint</td>
              <td>{directory.scim.endpoint}</td>
            </tr>
            <tr>
              <td className="uppercase py-4">SCIM Secret</td>
              <td>{directory.scim.secret}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tenant = config.tenant;
  const product = config.product;

  const directory = await findOrCreateDirectory(tenant, product);

  return {
    props: {
      directory,
    },
  };
};
