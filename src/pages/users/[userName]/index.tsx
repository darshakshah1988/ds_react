import Head from 'next/head';
import Link from 'next/link';

import { userService } from '../../../services';
import { getIdentifyUserName } from '../../../helpers';
import Layout from '../../../components/reusable/Layout';
import LogoutLink from '../../../components/auth/logout/LogoutLink';

export default function UserHomePage(props: any) {
  const { user } = props;
  const username = getIdentifyUserName(user || null);

  return (
    <>
      <Head>
        <title>Cherie Edit my password</title>
        <meta name="description" content="A default homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <h1>Welcome {user ? `${username} 🙂!` : '🙂!'}</h1>
          {user ? (
            <>
              <Link href={`/users/${username}/edit`}>
                <a>Update your Password</a>
              </Link>
              <LogoutLink>Logout</LogoutLink>
            </>
          ) : null}

          <Link href="/">
            <a>Go to Homepage</a>
          </Link>
        </Layout>
      </main>
    </>
  );
}

// Protected route only for authenticated users
export async function getServerSideProps(context: any) {
  const response = await userService.getServersideAuthUserDetails(context);
  if (!response.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    };
  }
  return {
    props: { user: response?.user ? response.user : null }
  };
}
