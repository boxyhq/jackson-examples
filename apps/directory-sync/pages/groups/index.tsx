import type { NextPage } from "next";
import Link from "next/link";
import Container from "../../components/Container";

const Groups: NextPage = () => {
  return (
    <Container title="Me">
      <div className="space-y-4">
        <h2 className="text-2xl">Groups</h2>
      </div>
    </Container>
  );
};

export default Groups;
