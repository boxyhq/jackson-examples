import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav className="border-gray-200 px-4 py-4 shadow">
        <div className="max-w-7xl mx-auto">
          <ul className="flex gap-4">
            <li>
              <Link to="/" className="font-normal text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="font-normal text-gray-900">
                Login
              </Link>
            </li>
            <li>
              <Link to="/profile" className="font-normal text-gray-900">
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
