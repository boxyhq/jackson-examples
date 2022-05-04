import React from 'react';

import logo from '../assets/logo.svg';

const Hero = () => (
  <div className='hero my-5 text-center'>
    <img className='app-logo mb-3' src={logo} alt='React logo' width='120' />
    <h1 className='mb-4'>React.js Sample Project</h1>

    <p className='lead'>
      This is a sample application that demonstrates an authentication flow for an SPA, using{' '}
      <a href='https://reactjs.org'>React.js</a>
    </p>
  </div>
);

export default Hero;
