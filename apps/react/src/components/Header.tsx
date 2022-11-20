import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { signOut, user, authStatus } = useAuth();
  const navigate = useNavigate();

  const loaded = authStatus === 'LOADED';
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
            {loaded && !user && (
              <li>
                <NavLink to='/login' className='font-normal text-gray-900'>
                  Login
                </NavLink>
              </li>
            )}
            {loaded && user && (
              <>
                <li>
                  <NavLink to='/profile' className='font-normal text-gray-900'>
                    Profile
                  </NavLink>
                </li>
                <li className='ml-auto'>
                  <button
                    type='button'
                    onClick={() =>
                      signOut(async () => {
                        // logout from server
                        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
                          method: 'DELETE',
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
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
