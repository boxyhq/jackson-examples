import React from 'react';

import logo from '../assets/logo.svg';

const Hero = () => (
  <div className='hero my-5 text-center'>
    <img className='app-logo mb-3' src={logo} alt='React logo' width='120' />
    <h1 className='mb-4'>Auth0 + SAML Jackson connection</h1>

    <p>
      This is a sample application that demonstrates SAML Jackson as a{' '}
      <a href='https://auth0.com/docs/authenticate/identity-providers/social-identity-providers/oauth2'>
        Generic OAuth2 connection
      </a>
      .
    </p>
  </div>
);

export default Hero;
