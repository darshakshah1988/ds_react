import React, { Fragment } from 'react';

import MetaHead from '../../../components/reusable/MetaHead';
import AdminLayout from '../../../admin/layouts/AdminLayout';
import PageInjector from '../../../admin/components/reuseable/PageInjector';
import ArtistListing from '../../../admin/components/artists/Artists/ArtistListing';

// Page
export default function AdminArtists() {
  return (
    <Fragment>
      <MetaHead>
        <title>Cherie: Admin Artists</title>
        <meta
          property="og:title"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
        <meta
          property="og:description"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
      </MetaHead>
      <PageInjector bottomGap={18}>
        <ArtistListing />
      </PageInjector>
    </Fragment>
  );
}

AdminArtists.Layout = AdminLayout;
