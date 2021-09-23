import { Fragment } from 'react';

import { IArtData } from '../../../types';
import ArtworkCard from './ArtworkCard';

import Div from '../../../../components/styled/Div';

// Types
type props = {
  artworks: Array<IArtData>;
};

// Component
export default function ArtworkRenderer(props: props) {
  const { artworks } = props;

  if (Array.isArray(artworks) && artworks.length > 0) {
    return (
      <Fragment>
        {artworks.map(artwork => {
          return (
            <Div key={artwork._id} $marginBottom={40}>
              <ArtworkCard {...artwork} />
            </Div>
          );
        })}
      </Fragment>
    );
  } else {
    return null;
  }
}
