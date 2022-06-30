import type { NextPage, GetServerSideProps } from "next";
import { signIn, useSession } from "next-auth/react";
import Router from "next/router";
import { FormEvent, useState } from "react";
import Container from "../components/Container";
import { extractDomain } from "../lib/utils";
import { env } from "../lib/env";

const Login: NextPage<{ product: string }> = ({ product }) => {
  const { data: session } = useSession();

  const [state, setState] = useState({
    email: "kiran@boxyhq.com",
  });

  // Update state when input changes
  const handleChange = (e: FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;

    setState({
      ...state,
      [name]: value,
    });
  };

  const loginUser = async (event: FormEvent) => {
    event.preventDefault();

    const authorizationParams = {
      tenant: extractDomain(state.email),
      product,
    };

    // This will redirect users to the IdP to sign in page
    signIn("boxyhq-saml", undefined, authorizationParams);
  };

  // If the session exists, redirect the users to /me
  if (session && session?.user) {
    Router.push("/me");
  }

  return (
    <Container title="Sign in">
      <div className="flex flex-col py-20 max-w-md mx-auto">
        <h2 className="text-center text-3xl mt-5">Log in to App</h2>
        <p className="text-center mt-4 font-medium text-gray-500">
          Click `Continue with SAML SSO` and you will be redirected to your
          third-party authentication provider to finish authenticating.
        </p>
        <div className="mt-3 mx-auto w-full max-w-sm">
          <div className="bg-white py-6 px-6 rounded">
            <form className="space-y-6" onSubmit={loginUser}>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600">
                  Work Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="username@boxyhq.com"
                    value={state.email}
                    onChange={handleChange}
                    className="appearance-none text-sm block w-full border border-gray-300 rounded placeholder-gray-400 focus:outline-none focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="px-4 py-2 w-full border border-transparent rounded text-sm font-medium text-white bg-indigo-600 focus:outline-none"
                >
                  Continue with SAML SSO
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      product: env.jackson.product,
    },
  };
};

export default Login;
