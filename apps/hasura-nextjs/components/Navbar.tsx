import classnames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function NavItem({ href, text }: { href: string; text: string }) {
  const router = useRouter();
  const isActive = router.asPath === href;

  return (
    <Link href={href}>
      <a
        className={classnames(
          isActive ? 'border-b-2 border-indigo-500 font-semibold' : '',
          'inline-flex items-center px-1 pt-1 text-base text-gray-900'
        )}>
        {text}
      </a>
    </Link>
  );
}

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className='bg-white shadow'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
            <button
              type='button'
              className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
              aria-controls='mobile-menu'
              aria-expanded='false'>
              <span className='sr-only'>Open main menu</span>
              <svg
                className='block h-6 w-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
              <svg
                className='hidden h-6 w-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              <NavItem href='/' text='Home' />
              <NavItem href='/hasura' text='Hasura' />
              <NavItem href='/me' text='Me' />
              {session && session.user ? (
                <button
                  onClick={() =>
                    signOut({
                      callbackUrl: `${window.location.origin}`,
                    })
                  }>
                  Sign out
                </button>
              ) : (
                <NavItem href='/login' text='Sign in' />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='sm:hidden' id='mobile-menu'>
        {/* Add mobile menu */}
      </div>
    </nav>
  );
}
