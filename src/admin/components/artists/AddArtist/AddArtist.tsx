import { Fragment } from 'react';

import AddArtistForm from './AddArtistForm';
import Breadcrumb from '../../reuseable/Breadcrumb';

import Flexer from '../../styled/Flexer';
import AddLink from '../../styled/AddLink';

// Component
export default function AddArtist() {
  // Here you can control state management of this component

  return (
    <Fragment>
      {/*  Text */}
      <Flexer
        leftNode={
          <Breadcrumb
            data={[
              { path: '/admin', text: 'Dashboard' },
              { path: '', text: 'Add Artist' }
            ]}
          />
        }
        rightNode={
          <AddLink href="/admin/artworks/add">Add New Artwork</AddLink>
        }
      />
      {/*  Form */}
      <AddArtistForm />
    </Fragment>
  );
}
