import React, { Fragment } from 'react';

import MetaHead from '../../../../components/reusable/MetaHead';
import AdminLayout from '../../../../admin/layouts/AdminLayout';
import PageInjector from '../../../../admin/components/reuseable/PageInjector';
import AddArtist from '../../../../admin/components/artists/AddArtist/AddArtist';

// Page
export default function AdminAddArtist() {
  return (
    <Fragment>
      <MetaHead>
        <title>Cherie: Admin Dashboarrd Add New Artist</title>
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
        <AddArtist />
      </PageInjector>
    </Fragment>
  );
}

AdminAddArtist.Layout = AdminLayout;
