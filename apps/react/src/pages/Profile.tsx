import React from 'react';
import useAuth from '../hooks/useAuth';

// type User = {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
// };

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className='mx-auto mt-10 max-w-7xl'>
        <div className='max-w-[50%]'>
          <div className='rounded border border-gray-200 bg-white py-5 px-5'>
            <p>Login to access the content.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto mt-10 max-w-7xl'>
      <div className='max-w-[50%]'>
        <div className='rounded border border-gray-200 bg-white py-5 px-5'>
          <ul className='flex flex-col space-y-3'>
            <li className='flex flex-col'>
              <span className='font-normal'>User ID</span>
              <span className='text-gray-500'>{user.id}</span>
            </li>
            <li className='flex flex-col'>
              <span className='font-normal'>Email</span>
              <span className='text-gray-500'>{user.email}</span>
            </li>
            <li className='flex flex-col'>
              <span className='font-normal'>First Name</span>
              <span className='text-gray-500'>{user.firstName}</span>
            </li>
            <li className='flex flex-col'>
              <span className='font-normal'>Last Name</span>
              <span className='text-gray-500'>{user.lastName}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
