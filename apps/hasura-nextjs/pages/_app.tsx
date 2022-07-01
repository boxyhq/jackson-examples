import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <Navbar />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default App;
