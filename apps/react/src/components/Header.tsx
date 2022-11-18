import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { apiUrl } from '../lib/jackson';

const Header = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

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
            {user && (
              <li className='ml-auto'>
                <button
                  type='button'
                  onClick={() =>
                    signOut(async () => {
                      // logout from server
                      const response = await fetch(`${apiUrl}/api/logout`, {
                        method: 'GET',
                        credentials: 'include',
                      });
                      if (response.status === 401) {
                        navigate('/login');
                      }
                    })
                  }
                  className='font-normal text-gray-900'>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
