import React, { Fragment } from 'react';

import MetaHead from '../../../components/reusable/MetaHead';
import AdminLayout from '../../../admin/layouts/AdminLayout';
import PageInjector from '../../../admin/components/reuseable/PageInjector';
import ArtworkListing from '../../../admin/components/artworks/Artworks/ArtworkListing';

// Page
export default function AdminArtworks() {
  return (
    <Fragment>
      <MetaHead>
        <title>Cherie: Admin Artworks</title>
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
        <ArtworkListing />
      </PageInjector>
    </Fragment>
  );
}

AdminArtworks.Layout = AdminLayout;
