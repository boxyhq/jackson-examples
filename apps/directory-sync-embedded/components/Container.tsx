import Head from 'next/head';

export default function Container(props: any) {
  const { children, title, ...customMeta } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <main>{children}</main>
      </div>
    </>
  );
}
