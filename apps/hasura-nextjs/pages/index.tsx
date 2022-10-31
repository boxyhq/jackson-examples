import type { NextPage } from 'next';
import Container from '../components/Container';

const Home: NextPage = () => {
  return (
    <Container title='Home'>
      <div className='space-y-4'>
        <h2 className='text-2xl'>SAML Jackson + Hasura GraphQL Example</h2>
        <p>
          This is an example web app that demonstrate how to use Enterprise SSO for Hasura GraphQL
          authentication (via JWT).
        </p>
        <p className='text-gray-600'>
          You can use{' '}
          <a href='https://mocksaml.com/' className='font-medium underline underline-offset-2'>
            Mock SAML
          </a>{' '}
          a free SAML 2.0 Identity Provider to test the SAML SSO integration.
        </p>
        <ul className='flex flex-row space-x-6'>
          <li>
            <a
              className='underline underline-offset-2'
              target='_blank'
              rel='noreferrer'
              href='https://boxyhq.com/docs/jackson/overview'>
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
      </div>
    </Container>
  );
};

export default Home;
