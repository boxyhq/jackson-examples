import type { NextPage, GetServerSideProps } from 'next';
import { signIn, useSession } from 'next-auth/react';
import Router from 'next/router';
import { FormEvent, useState } from 'react';
import Container from '../components/Container';
import { extractDomain } from '../lib/utils';
import { env } from '../lib/env';

const Login: NextPage<{ product: string }> = ({ product }) => {
  const { data: session } = useSession();

  const [state, setState] = useState({
    email: 'jackson@example.com',
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
    signIn('boxyhq-saml', undefined, authorizationParams);
  };

  // If the session exists, redirect the users to /me
  if (session && session?.user) {
    Router.push('/me');
  }

  return (
    <Container title='Sign in'>
      <div className='mx-auto flex max-w-md flex-col py-20'>
        <h2 className='mt-5 text-center text-3xl'>Login with SAML SSO</h2>
        <div className='mx-auto mt-3 w-full max-w-sm'>
          <div className='rounded bg-white px-6 py-6'>
            <form className='space-y-6' onSubmit={loginUser}>
              <div>
                <label htmlFor='email' className='block text-sm text-gray-600'>
                  Work Email
                </label>
                <div className='mt-1'>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='jackson@example.com'
                    value={state.email}
                    onChange={handleChange}
                    className='block w-full appearance-none rounded border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500'
                    required
                  />
                </div>
              </div>
              <div>
                <button
                  type='submit'
                  className='w-full rounded border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus:outline-none'>
                  Continue
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
