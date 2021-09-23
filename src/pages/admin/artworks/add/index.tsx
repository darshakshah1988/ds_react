import React, { Fragment } from 'react';

import MetaHead from '../../../../components/reusable/MetaHead';
import AdminLayout from '../../../../admin/layouts/AdminLayout';
import PageInjector from '../../../../admin/components/reuseable/PageInjector';
import AddArtwork from '../../../../admin/components/artworks/AddArtwork/AddArtwork';

// Page
export default function AdminAddArtwork() {
  return (
    <Fragment>
      <MetaHead>
        <title>Cherie: Admin Dashboarrd Add New Artwork</title>
        <meta
          property="og:title"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
        <meta
          property="og:description"
          content="Cherie: NFTs Art Marketplace, Crypto Collectibles, CryptoKitties, Decentraland, and more on Ethereum"
        />
      </MetaHead>
      <PageInjector bottomGap={256}>
        <AddArtwork />
      </PageInjector>
    </Fragment>
  );
}

AdminAddArtwork.Layout = AdminLayout;
