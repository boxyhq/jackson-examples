import type { NextPage } from "next";
import Container from "../components/Container";

const Home: NextPage = () => {
  const webhookEndpoint = `http://localhost:3000/api/webhook`;

  return (
    <Container title="Directory Sync Example">
      <div className="space-y-4">
        <h2 className="text-2xl">
          Example App with Directory Sync powered by BoxyHQ
        </h2>
        <p>
          This is an example app to demonstrate how to use{" "}
          <strong>Directory Sync</strong>.
        </p>
        <ul className="flex flex-row space-x-6">
          <li>
            <a
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
              href="https://boxyhq.com/docs/jackson/introduction"
            >
              Documentation
            </a>
          </li>
          <li>
            <a
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/boxyhq/jackson"
            >
              Github
            </a>
          </li>
          <li>
            <a
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
              href="https://www.npmjs.com/package/@boxyhq/saml-jackson"
            >
              NPM
            </a>
          </li>
          <li>
            <a
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
              href="https://hub.docker.com/r/boxyhq/jackson"
            >
              Docker Hub
            </a>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default Home;
