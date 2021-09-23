import { Fragment } from 'react';
import styled, { css } from 'styled-components';

import { IArtistData } from '../../../types';
import ArtistGridCard from './ArtistGridCard';
import ArtistListCard from './ArtistListCard';

// Types
type props = {
  display: 'grid' | 'list';
  artists: Array<IArtistData>;
};

// Component
export default function ArtistRenderer(props: props) {
  const { artists, display } = props;

  if (Array.isArray(artists) && artists.length > 0) {
    return (
      <ArtistRenderer.Container>
        <ArtistRenderer.Row $mode={display}>
          {display === 'grid'
            ? renderArtistGrid(artists)
            : renderArtistList(artists)}
        </ArtistRenderer.Row>
      </ArtistRenderer.Container>
    );
  }

  return null;
}

// ------------------- Styles -------------------
const COLUMN_GAP = 16;

ArtistRenderer.Container = styled.div`
  margin-top: 32px;
`;

ArtistRenderer.Row = styled.div<{ $mode?: string }>`
  ${({ $mode }) => {
    if ($mode === 'grid') {
      return css`
        & {
          display: flex;
          flex-wrap: wrap;
        }
      `;
    }
  }}
  margin-right: -${COLUMN_GAP}px;
  margin-left: -${COLUMN_GAP}px;

  & > div {
    margin-bottom: 32px;
  }
`;

// Structure of the Grid Column
ArtistRenderer.GridCol = styled.div`
  position: relative;
  width: 100%;
  padding-right: ${COLUMN_GAP}px;
  padding-left: ${COLUMN_GAP}px;

  /* Our Grid System Breakpoints. */
  /* Take 6 columns width out of 12 to represent 2 cards */
  @media (min-width: 576px) {
    flex: 0 0 auto;
    width: 50%;
  }

  /* Take 6 columns width out of 12 to represent 2 cards */
  @media (min-width: 768px) {
    flex: 0 0 auto;
    width: 50%;
  }

  /* Take 6 columns width out of 12 to represent 2 cards */
  @media (min-width: 992px) {
    flex: 0 0 auto;
    width: 50%;
  }

  /* Take 4 columns width out of 12 to represent 3 cards  */
  @media (min-width: 1200px) {
    flex: 0 0 auto;
    width: 33.3333333333%;
  }
`;

// Structure of the List Column
ArtistRenderer.ListCol = styled.div`
  position: relative;
  width: 100%;
  padding-right: ${COLUMN_GAP}px;
  padding-left: ${COLUMN_GAP}px;
`;

// ------------------- End - Styles -------------------

// ------------------- Functions -------------------
// Function to render ArtistGridCards
function renderArtistGrid(artists: Array<IArtistData>) {
  if (Array.isArray(artists) && artists.length > 0) {
    return (
      <Fragment>
        {artists.map(item => {
          return (
            <ArtistRenderer.GridCol key={item._id}>
              <ArtistGridCard {...item} />
            </ArtistRenderer.GridCol>
          );
        })}
      </Fragment>
    );
  }
}

// Function to render ArtistListCards
function renderArtistList(artists: Array<IArtistData>) {
  if (Array.isArray(artists) && artists.length > 0) {
    return (
      <Fragment>
        {artists.map(item => {
          return (
            <ArtistRenderer.ListCol key={item._id}>
              <ArtistListCard {...item} />
            </ArtistRenderer.ListCol>
          );
        })}
      </Fragment>
    );
  }
  return null;
}

// ------------------- End - Functions -------------------
