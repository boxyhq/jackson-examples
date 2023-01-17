import type { NextPage } from 'next';
import Container from '../components/Container';

const Home: NextPage = () => {
  const webhookEndpoint = `http://localhost:3366/api/webhook`;

  return (
    <Container title='Directory Sync Example'>
      <div className='space-y-4'>
        <h2 className='text-2xl'>Example App with Directory Sync powered by BoxyHQ</h2>
        <p>
          This is an example app to demonstrate how to use <strong>Directory Sync</strong>.
        </p>
        <ul className='flex flex-row space-x-6'>
          <li>
            <a
              className='underline underline-offset-2'
              target='_blank'
              rel='noreferrer'
              href='https://boxyhq.com/docs/directory-sync/overview'>
              Documentation
            </a>
          </li>
          <li>
            <a
              className='underline underline-offset-2'
              target='_blank'
              rel='noreferrer'
              href='https://github.com/boxyhq/jackson'>
              Github
            </a>
          </li>
          <li>
            <a
              className='underline underline-offset-2'
              target='_blank'
              rel='noreferrer'
              href='https://www.npmjs.com/package/@boxyhq/saml-jackson'>
              NPM
            </a>
          </li>
          <li>
            <a
              className='underline underline-offset-2'
              target='_blank'
              rel='noreferrer'
              href='https://hub.docker.com/r/boxyhq/jackson'>
              Docker Hub
            </a>
          </li>
        </ul>

        <div>
          <h3 className='pb-2 text-xl'>Getting Started</h3>
          <ol className='list-inside list-decimal'>
            <li className='py-1'>
              Create a Directory Sync connection in the <strong>BoxyHQ Admin Portal</strong> using following
              values:
            </li>
            <li className='py-1'>
              Tenant: <strong>boxyhq.com</strong>
            </li>
            <li className='py-1'>
              Product: <strong>saml-jackson</strong>
            </li>
            <li className='py-1'>
              Webhook URL: <strong>{webhookEndpoint}</strong>
            </li>
            <li className='py-1'>
              Webhook Secret: <strong>any-secret</strong>
            </li>
          </ol>
        </div>
        <div className='flex flex-col space-y-2'>
          <p>
            The demo is configured for the tenant <strong>boxyhq.com</strong>.
          </p>
          <p>
            Open <strong>apps/directory-sync/prisma/seed.ts</strong> to change the tenant.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Home;
