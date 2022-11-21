import React from 'react';

const Protected = () => {
  return (
    <div className='mx-auto mt-10 max-w-7xl'>
      <div className='max-w-[50%]'>
        <div className='rounded border border-gray-200 bg-white py-5 px-5'>
          You're seeing a protected route ... If you try to access this without logging in , you will be
          redirected to login page and once logged in will be navigated back here.
        </div>
      </div>
    </div>
  );
};

export default Protected;
