import React, { Fragment } from 'react';

import { userService } from '../../services';
import MetaHead from '../../components/reusable/MetaHead';
import FormLayout from '../../components/reusable/FormLayout';
import SigninForm from '../../components/auth/signin/SigninForm';

export default function SigninPage() {
  return (
    <Fragment>
      <MetaHead>
        <title>Cherie: Sign in to Get your first NFT.</title>
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
        <SigninForm />
      </FormLayout>
    </Fragment>
  );
}

// Guest route only for guest users
export async function getServerSideProps(context: any) {
  const response = await userService.getServersideAuthUserDetails(context);
  if (response.user) {
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
