import { Fragment } from 'react';
import Error from 'next/error';

import { authService } from '../../../../../services';
import {
  UserIdWithToken,
  ServerResponseMessageStatus
} from '../../../../../types';
import MetaHead from '../../../../../components/reusable/MetaHead';
import CenterLayoutWrapper from '../../../../../components/reusable/CenterLayoutWrapper';
import VerifyEmailMessage from '../../../../../components/auth/verify-email/VerifyEmailMessage';

export default function VerifyEmailPage(props: ServerResponseMessageStatus) {
  const { status, message } = props;

  if (status === 'error') {
    return <Error statusCode={404} />;
  }

  return (
    <Fragment>
      <MetaHead>
        <title>Cherie: Verify your account</title>
        <meta
          property="og:title"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
        <meta
          property="og:description"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
      </MetaHead>
      <main>
        <CenterLayoutWrapper>
          <VerifyEmailMessage message={message} />
        </CenterLayoutWrapper>
      </main>
    </Fragment>
  );
}

export async function getServerSideProps(context: { params: UserIdWithToken }) {
  const {
    params: { userId, token }
  } = context;

  const result = await authService
    .verifyEmail({ userId, token })
    .then(function(res) {
      return res;
    })
    .catch(function(err) {
      return err;
    });

  return {
    props: result
  };
}
