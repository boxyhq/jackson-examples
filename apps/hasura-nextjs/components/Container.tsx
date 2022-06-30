import Head from "next/head";

export default function Container(props: any) {
  const { children, title, ...customMeta } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main>{children}</main>
      </div>
    </>
  );
}
