import React from 'react';

const Home = () => {
  return (
    <div className='mx-auto mt-10 max-w-7xl'>
      <div className='space-y-3 border border-gray-200 px-3 py-3'>
        <h1 className='text-2xl'>Enterprise SSO + React.js Framework Example</h1>
        <p>This is an example web app that demonstrate how to use Enterprise SSO with React.js Framework.</p>
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
    </div>
  );
};

export default Home;
