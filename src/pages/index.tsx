import React, { Fragment } from 'react';

import { userService } from '../services';
import { getIdentifyUserName } from '../helpers';
import MetaHead from './../components/reusable/MetaHead';
import DefaultLayout from '../components/layouts/DefaultLayout';
import HomeIntro from '../components/home/HomeIntro';

export default function HomePage(props: any) {
  const { user } = props;
  const username = getIdentifyUserName(user || null);

  return (
    <Fragment>
      <MetaHead>
        <title>
          Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties,
          Decentraland, and more on Ethereum
        </title>
        <meta
          property="og:title"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
        <meta
          property="og:description"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
      </MetaHead>
      <HomeIntro username={username} />
    </Fragment>
  );
}

HomePage.Layout = DefaultLayout;

export async function getServerSideProps(context: any) {
  const response = await userService.getServersideAuthUserDetails(context);
  return {
    props: { user: response?.user ? response.user : null }
  };
}
