import Head from 'next/head';

import { userService } from '../../../../services';
import Layout from '../../../../components/reusable/Layout';
import BackLink from '../../../../components/reusable/BackLink';
import EditUserPasswordForm from '../../../../components/users/EditUserPasswordForm';

export default function EditUserPasswordPage() {
  return (
    <>
      <Head>
        <title>Cherie Edit my password</title>
        <meta name="description" content="A default homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <h1>Edit your Password!</h1>
          <EditUserPasswordForm />
          <BackLink>Back</BackLink>
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
