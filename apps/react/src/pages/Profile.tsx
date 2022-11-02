import React, { useEffect, useState } from "react";

import { getProfileByJWT } from "../lib/jackson";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await getProfileByJWT();

      if (error) {
        return;
      }

      setUser(data);
    })();
  }, []);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto mt-10">
        <div className="max-w-[50%]">
          <div className="py-5 px-5 border-gray-200 border bg-white rounded">
            <p>Login to access the content.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="max-w-[50%]">
        <div className="py-5 px-5 border-gray-200 border bg-white rounded">
          <ul className="flex flex-col space-y-3">
            <li className="flex flex-col">
              <span className="font-normal">User ID</span>
              <span className="text-gray-500">{user.id}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-normal">Email</span>
              <span className="text-gray-500">{user.email}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-normal">First Name</span>
              <span className="text-gray-500">{user.firstName}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-normal">Last Name</span>
              <span className="text-gray-500">{user.lastName}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
