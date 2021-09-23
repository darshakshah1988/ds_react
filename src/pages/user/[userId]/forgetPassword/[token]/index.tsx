import { Fragment } from 'react';

import { UserIdWithToken } from '../../../../../types';
import MetaHead from '../../../../../components/reusable/MetaHead';
import FormLayout from '../../../../../components/reusable/FormLayout';
import NewPasswordForm from '../../../../../components/auth/forget-password/NewPasswordForm';

// Page
export default function ResetPasswordPage(props: UserIdWithToken) {
  const { userId, token } = props;

  return (
    <Fragment>
      <MetaHead>
        <title>Cherie: Reset password</title>
        <meta
          property="og:title"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
        <meta
          property="og:description"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
      </MetaHead>
      <FormLayout>
        <NewPasswordForm userId={userId} token={token} />
      </FormLayout>
    </Fragment>
  );
}

export async function getServerSideProps(context: { params: UserIdWithToken }) {
  const {
    params: { userId, token }
  } = context;

  return {
    props: {
      userId,
      token
    }
  };
}
