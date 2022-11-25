import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Container from '../components/Container';

const Me: NextPage = () => {
  const { data: session } = useSession();

  // Session exists
  if (session && session?.user) {
    return (
      <Container title='Me'>
        <div className='space-y-4'>
          <h2 className='text-2xl'>{`Hello ${session.user.name}`}</h2>
          <p className='text-gray-500'>Session Object</p>
          <div className='rounded bg-slate-200 p-4'>
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container title='Me'>
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
};

export default Me;
