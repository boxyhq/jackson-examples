import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav className='border-gray-200 px-4 py-4 shadow'>
        <div className='mx-auto max-w-7xl'>
          <ul className='flex gap-4'>
            <li>
              <NavLink to='/' className='font-normal text-gray-900'>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to='/login' className='font-normal text-gray-900'>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to='/profile' className='font-normal text-gray-900'>
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
