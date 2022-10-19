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

        <div className='space-y-2 border bg-cyan-100 px-3 py-3'>
          <p>
            Your webhook endpoint is <strong>{webhookEndpoint}</strong>
          </p>
          <p>Create a Directory on the SAML Jackson for the tenant you want to sync for.</p>
          <p>
            The demo is configured for the tenant <strong>boxyhq.com</strong>
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
