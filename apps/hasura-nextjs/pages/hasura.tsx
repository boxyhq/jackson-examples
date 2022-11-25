import { gql } from '@apollo/client';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Container from '../components/Container';
import { apolloClient } from '../lib/utils';

const Hasura: NextPage = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await apolloClient({
        token: session?.token as string,
      }).query({
        query: gql`
          query Users {
            users {
              id
              name
              email
              image
              emailVerified
            }
          }
        `,
      });

      if (data.users) {
        setUsers(data.users);
      }
    };

    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [session, status]);

  if (!session) {
    return (
      <Container title='Protected'>
        <div className='space-y-4'>
          <h2 className='text-2xl'>Access Denied</h2>
          <p>
            <Link href='/login' className='underline underline-offset-4'>
              You must be signed in to view this page
            </Link>
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container title='Protected'>
      <div className='space-y-4'>
        <h2 className='text-2xl'>Users</h2>
        <p className='text-gray-500'>GET /v1/graphql</p>
        <p className='text-gray-500'>
          This demo is configured to work with 2 `x-hasura-role` (admin, developer). `admin` can see all the
          rows in the users table. `developer` can see their own row. If no role is provided the `developer`
          role is assumed.
        </p>
        <div className='h-96 overflow-scroll rounded bg-slate-200 p-4'>
          <pre>{JSON.stringify(users, null, 3)}</pre>
        </div>
      </div>
    </Container>
  );
};

export default Hasura;
