import React from 'react';
import Head from 'next/head';

// Types
type Props = {
  children?: React.ReactNode;
};

// Component
export default function MetaHead(props: Props) {
  const { children } = props;
  return (
    <Head>
      <meta content="Chérie" name="author" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Chérie" />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_HOST} />
      <meta property="og:image" content={process.env.NEXT_PUBLIC_HOST} />
      <meta property="twitter:card" content="summary_large_image" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Chérie" />
      <link href={process.env.NEXT_PUBLIC_ORIGIN} rel="preconnect" />
      <link rel="icon" href="/favicon.ico" />

      <meta content="Chérie" name="apple-mobile-web-app-title" />
      <meta content="Chérie" name="application-name" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#FFFFFF" />
      {children}
    </Head>
  );
}
