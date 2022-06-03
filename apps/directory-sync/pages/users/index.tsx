import type { NextPage } from "next";
import Link from "next/link";
import Container from "../../components/Container";

const Users: NextPage = () => {
  return (
    <Container title="Me">
      <div className="space-y-4">
        <h2 className="text-2xl">Users</h2>
      </div>
    </Container>
  );
};

export default Users;
