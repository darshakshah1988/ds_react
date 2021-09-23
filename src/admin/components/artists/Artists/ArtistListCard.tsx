import { useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';
import styled from 'styled-components';
import { rem } from 'polished';

import { IArtistData } from '../../../types';
import { capitalized, getFirstCharacter, truncate } from '../../../../helpers';
import { DeleteIcon, EditIcon, PlusIcon } from '../../../svgs';

import { ServerResponseMessageStatus } from '../../../../types';
import { artistService } from '../../../../services';
import Div from '../../../../components/styled/Div';
import { OutlinePrimaryStyles } from '../../../styles/reuse';

// Component
export default function ArtistListCard(props: IArtistData) {
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
    <ArtistListCard.Card>
      <ArtistListCard.CardBody>
        <ArtistListCard.CardFlex>
          {/* ======= FlexA ======= */}
          <ArtistListCard.CardFlexA>
            {profilePicture ? (
              <img src={profilePicture} alt={name} />
            ) : (
              <ArtistListCard.Dummy>
                <span>{getFirstCharacter(name)}</span>
              </ArtistListCard.Dummy>
            )}
          </ArtistListCard.CardFlexA>
          {/* ======= End - FlexA ======= */}

          {/* ======= FlexB ======= */}
          <ArtistListCard.CardFlexB>
            <ArtistListCard.CardTitlesWrapper>
              <ArtistListCard.CardTitle>{name}</ArtistListCard.CardTitle>
              <ArtistListCard.CardStatus $status={status}>
                {capitalized(status)}
              </ArtistListCard.CardStatus>
            </ArtistListCard.CardTitlesWrapper>

            <ArtistListCard.CardDescription>
              {truncate(overview, 355)}
            </ArtistListCard.CardDescription>

            {/* ======= Add New Artwork Link ======= */}
            <Div $marginBottom={12}>
              <ArtistListCard.AddArtworkLink href="/admin/artworks/add">
                <PlusIcon />
                <span>Add Artwork</span>
              </ArtistListCard.AddArtworkLink>
            </Div>

            {/* ======= Add New Artwork Link ======= */}

            {/* ======= Absolute ======= */}
            <ArtistListCard.CardLinkGroup>
              <a href={`/admin/artists/edit/${_id}`}>
                <EditIcon width={18} height={18} />
              </a>

              {!isDeleted ? (
                <div role="link" onClick={() => deleteArtist(_id)}>
                  <DeleteIcon width={18} height={18} />
                </div>
              ) : null}
            </ArtistListCard.CardLinkGroup>
            {/* ======= End - Absolute ======= */}
          </ArtistListCard.CardFlexB>
          {/* ======= End - FlexB ======= */}
        </ArtistListCard.CardFlex>
      </ArtistListCard.CardBody>
    </ArtistListCard.Card>
  );
}

ArtistListCard.Card = styled.div`
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;

ArtistListCard.CardBody = styled.div`
  flex: 1 1 auto;
  padding: 32px;
`;

/* ======= Flex =======  */
ArtistListCard.CardFlex = styled.div`
  @media (min-width: 768px) {
    display: flex;
  }

  > div:first-child {
    margin-right: 32px;
  }
`;

ArtistListCard.CardFlexA = styled.div`
  & > img {
    display: block;
    border-radius: 5px;
    background-color: #eee;
    width: 185px;
    height: 185px;
    margin: 0 auto ${rem(24)};
  }

  @media (min-width: 768px) {
    & > img {
      margin: 0;
    }
  }
`;

ArtistListCard.Dummy = styled.div`
  position: relative;
  display: block;
  border-radius: 5px;
  background-color: #868e96;
  width: 185px;
  height: 185px;
  margin: 0 auto ${rem(24)};

  > span {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    font-size: ${rem(24)};
    color: #dee2e6;
  }

  @media (min-width: 768px) {
    & {
      margin: 0;
    }
  }
`;

ArtistListCard.CardFlexB = styled.div``;

/* ======= End - Flex =======  */

ArtistListCard.CardImageWrap = styled.div``;

/* ======= Titles =======  */
ArtistListCard.CardTitlesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
`;

ArtistListCard.CardTitle = styled.span`
  font-size: 20px;
  font-weight: 500;
  color: #272b2f;
  margin-bottom: 0;
  margin-right: 20px;
`;

ArtistListCard.CardStatus = styled.span<{ $status: string }>`
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  background-color: ${({ $status }) =>
    $status === 'active' ? '#1bb964' : '#FC686F'};
  border-radius: 99999px;
  padding: 4px 16px;
`;

ArtistListCard.CardDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #aaaaaa;
  margin-bottom: 16px;
`;
/* ======= End - Titles =======  */

ArtistListCard.AddArtworkLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${rem(6)} ${rem(14)};
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

/* ======= Link Group =======  */
ArtistListCard.CardLinkGroup = styled.div`
  display: inline-flex;
  align-items: center;

  & > * {
    padding: 4px;
  }

  & > a {
    color: #4e608e;
  }

  & > div {
    color: #fc686f;
    cursor: pointer;
  }

  @media (min-width: 992px) {
    position: absolute;
    top: 18px;
    right: 24px;
  }
`;

/* ======= End - Link Group =======  */
