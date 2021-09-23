import { Fragment } from 'react';

import EditArtistForm from './EditArtistForm';
import Breadcrumb from '../../reuseable/Breadcrumb';

import Flexer from '../../styled/Flexer';
import AddLink from '../../styled/AddLink';

// Component
export default function EditArtist(props: any) {
  const { artist } = props;

  return (
    <Fragment>
      {/*  Text */}
      <Flexer
        leftNode={
          <Breadcrumb
            data={[
              { path: '/admin', text: 'Dashboard' },
              { path: '', text: 'Edit Artist' }
            ]}
          />
        }
        rightNode={
          <AddLink href="/admin/artworks/add">Add New Artwork</AddLink>
        }
      />
      {/*  Form */}
      <EditArtistForm artist={artist} />
    </Fragment>
  );
}
