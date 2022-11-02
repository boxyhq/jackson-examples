import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { oAuth2AuthCodePKCE, authenticate } from "../lib/jackson";

const Login = () => {
  const [tenant, setTenant] = useState("boxyhq.com");
  const navigate = useNavigate();

  const oauth = oAuth2AuthCodePKCE(tenant);

  useEffect(() => {
    oauth
      .isReturningFromAuthServer()
      .then(async (hasAuthCode: boolean) => {
        if (!hasAuthCode) {
          console.log("Something wrong...no auth code.");
        }

        return oauth.getAccessToken().then(async (token) => {
          await authenticate(token.token?.value);
          navigate("/profile");
        });
      })
      .catch((potentialError) => {
        if (potentialError) {
          console.log(potentialError);
        }
      });
  });

  // Start the authorize flow
  const authorize = () => {
    oauth.fetchAuthorizationCode();
  };

  return (
    <div className="max-w-7xl mx-auto h-screen">
      <div className="flex flex-col space-y-5 justify-center h-full">
        <h2 className="text-center text-3xl">Log in to App</h2>
        <div className="max-w-md mx-auto w-full px-3 md:px-0">
          <div className="py-5 px-5 border-gray-200 border bg-white rounded">
            <form className="space-y-3" method="POST" onSubmit={authorize}>
              <label htmlFor="tenant" className="block text-sm">
                Tenant ID
              </label>
              <input
                type="text"
                name="tenant"
                placeholder="boxyhq"
                defaultValue="boxyhq.com"
                className="appearance-none text-sm block w-full border border-gray-300 rounded placeholder-gray-400 focus:outline-none focus:ring-indigo-500"
                required
                onChange={(e) => setTenant(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 w-full border border-transparent rounded text-sm font-medium text-white bg-indigo-600 focus:outline-none"
              >
                Continue with SAML SSO
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
