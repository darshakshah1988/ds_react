import React, { Fragment } from 'react';

import { artistService } from '../../../../../services';
import { NewArtist } from '../../../../../admin/types';
import MetaHead from '../../../../../components/reusable/MetaHead';
import AdminLayout from '../../../../../admin/layouts/AdminLayout';
import PageInjector from '../../../../../admin/components/reuseable/PageInjector';
import EditArtist from '../../../../../admin/components/artists/EditArtist/EditArtist';

// Props
type Props = {
  artist: NewArtist;
};

// Page
export default function AdminEditArtist(props: Props) {
  const { artist } = props;

  return (
    <Fragment>
      <MetaHead>
        <title>Cherie: Admin Dashboarrd Edit Artist</title>
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
        <EditArtist artist={artist || null} />
      </PageInjector>
    </Fragment>
  );
}

AdminEditArtist.Layout = AdminLayout;

export async function getServerSideProps(context: any) {
  const response = await artistService.getServersideArtistDetails(context);
  if (!response.artist) {
    return {
      redirect: {
        destination: '/admin/artists/',
        permanent: false
      }
    };
  }
  return {
    props: response
  };
}
