import { useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';
import styled, { css } from 'styled-components';
import { rem } from 'polished';

import { IArtistData } from '../../../types';
import { DeleteIcon, EditIcon, PlusIcon } from '../../../svgs';

import { ServerResponseMessageStatus } from '../../../../types';
import { artistService } from '../../../../services';
import { OutlinePrimaryStyles } from '../../../styles/reuse';
import { capitalized, getFirstCharacter, truncate } from '../../../../helpers';

// Component
export default function ArtistGridCard(props: IArtistData) {
  const { _id, status, name, overview, profilePicture, isDeleted } = props;

  const router = useRouter(); // Get router

  // State management for the AddArtistForm
  const [
    serverSideSuccess,
    setServerSideSuccess
  ] = useState<ServerResponseMessageStatus | null>(null);

  function deleteArtist(id: string) {
    if (confirm('Are you sure you want to delete the following artist?')) {
      const token = cookie.get('token') || ''; // Get the auth token
      if (id) {
        artistService
          .deleteArtist({ artists: [id] }, token)
          .then(function(response) {
            setServerSideSuccess(response);
            alert(
              response?.message ||
                'The delete operation has been successfully done.'
            );
            router.reload();
          })
          .catch(function(error) {
            setServerSideSuccess(error);
            alert(
              error?.message ||
                'The deletion operation is not completed due to a problem.'
            );
          });
      }
    }
  }

  return (
    <ArtistGridCard.Card>
      <ArtistGridCard.CardBody>
        <ArtistGridCard.CardImageWrap $image={!!profilePicture}>
          {profilePicture ? (
            <img src={profilePicture} alt={name} />
          ) : (
            <span>{getFirstCharacter(name)}</span>
          )}

          {/* =========== Absolute =========== */}

          <ArtistGridCard.CardStatus $status={status}>
            {capitalized(status)}
          </ArtistGridCard.CardStatus>

          <ArtistGridCard.CardLinkGroup>
            <a href={`/admin/artists/edit/${_id}`}>
              <EditIcon width={14} height={14} />
            </a>

            {!isDeleted ? (
              <div role="link" onClick={() => deleteArtist(_id)}>
                <DeleteIcon width={14} height={14} />
              </div>
            ) : null}
          </ArtistGridCard.CardLinkGroup>

          {/* =========== End - Absolute =========== */}
        </ArtistGridCard.CardImageWrap>

        {/* =========== Holder =========== */}
        <ArtistGridCard.CardTitleLinkHolder>
          <ArtistGridCard.CardTitle>{name}</ArtistGridCard.CardTitle>

          <ArtistGridCard.CardDescription>
            {truncate(overview, 353)}
          </ArtistGridCard.CardDescription>

          <ArtistGridCard.AddArtworkLink href="/admin/artworks/add">
            <PlusIcon />
            <span>Add Artwork</span>
          </ArtistGridCard.AddArtworkLink>
        </ArtistGridCard.CardTitleLinkHolder>
        {/* =========== Holder =========== */}
      </ArtistGridCard.CardBody>
    </ArtistGridCard.Card>
  );
}

ArtistGridCard.Card = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;

ArtistGridCard.CardBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding: 16px 16px;
`;

ArtistGridCard.CardImageWrap = styled.div<{ $image: boolean }>`
  position: relative;
  display: block;

  /* Behavior of profile picture */
  ${({ $image }) => {
    if ($image) {
      return css`
        /* Image on the card will be Square. */
        & {
          padding-top: 100%;
          background-color: #eee;
        }
      `;
    } else {
      return css`
        /* For the placeholder */
        & {
          border-radius: 5px;
          padding-top: 100%;
          background-color: #868e96;
        }
      `;
    }
  }}

  /* Manage Square Image. */
  & > img {
    display: block;
    border-radius: 5px;

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  /* Manage Text */
  & > span {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    bottom: 0;
    left: 0;
    right: 0;
    top: 0;

    font-size: ${rem(24)};
    color: #dee2e6;
  }
`;

// =========== Absolute ===========
ArtistGridCard.CardStatus = styled.div<{ $status: string }>`
  position: absolute;
  top: 14px;
  left: 14px;

  font-size: 10px;
  font-weight: 500;
  color: #fff;
  background-color: ${({ $status }) =>
    $status === 'active' ? '#1bb964' : '#FC686F'};
  border-radius: 99999px;
  padding: 4px 12px;
`;

ArtistGridCard.CardLinkGroup = styled.div`
  background-color: #000;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-left: ${rem(18)};
  padding-right: ${rem(18)};
  border-radius: 9999px;

  position: absolute;
  top: 14px;
  right: 14px;

  & > * {
    padding: 4px;
  }

  & > a {
    color: #fff;
  }

  & > div {
    color: #fff;
    cursor: pointer;
  }
`;

// =========== End - Absolute ===========

// Title, Description and Add Artwork
ArtistGridCard.CardTitleLinkHolder = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

ArtistGridCard.CardTitle = styled.h1`
  font-size: 18px;
  font-weight: 500;
  color: #272b2f;
  margin-top: 16px;
  margin-bottom: 8px;
`;

ArtistGridCard.CardDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #aaaaaa;
  margin-bottom: 16px;
`;

ArtistGridCard.AddArtworkLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  margin-top: auto;
  padding: ${rem(12)} ${rem(14)};
  border-radius: 3px;

  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;

  ${OutlinePrimaryStyles};

  > svg {
    margin-right: 8px;
    width: 12px;
    height: 12px;
  }
`;
