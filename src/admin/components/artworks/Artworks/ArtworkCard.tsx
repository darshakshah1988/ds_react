import { useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';
import styled from 'styled-components';
import { rem } from 'polished';
import { format } from 'date-fns';

import { IArtData } from '../../../types';
import { getFirstCharacter } from '../../../../helpers';
import { DeleteIcon, EditIcon } from '../../../svgs';

import { ServerResponseMessageStatus } from '../../../../types';
import { artService } from '../../../../services';

// Component
export default function ArtworkCard(props: IArtData) {
  const {
    _id,
    currency,
    fileUrl,
    category,
    subCategory,
    name,
    price,
    artist,
    registeredDate,
    isDeleted
  } = props;

  const router = useRouter(); // Get router

  // State management for the AddArtistForm
  const [
    serverSideSuccess,
    setServerSideSuccess
  ] = useState<ServerResponseMessageStatus | null>(null);

  function deleteArt(id: string) {
    if (confirm('Are you sure you want to delete the following artwork?')) {
      const token = cookie.get('token') || ''; // Get the auth token
      if (id) {
        artService
          .deleteArt({ arts: [id] }, token)
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

  // Styles
  return (
    <ArtworkCard.Card>
      <ArtworkCard.CardBody>
        <ArtworkCard.CardFlex>
          {/* ======= FlexA ======= */}
          <ArtworkCard.CardFlexA>
            {fileUrl ? (
              <img src={fileUrl} alt={name} />
            ) : (
              <ArtworkCard.Dummy>
                <span>{getFirstCharacter(name)}</span>
              </ArtworkCard.Dummy>
            )}
          </ArtworkCard.CardFlexA>
          {/* ======= End - FlexA ======= */}

          {/* ======= FlexB ======= */}
          <ArtworkCard.CardFlexB>
            <ArtworkCard.FlexNest>
              <ArtworkCard.FlexNestA>
                <ArtworkCard.CardCategoryInfo>
                  <ArtworkCard.CardCategory>
                    {category === 'TA' ? 'Traditional' : 'NFT'} -{' '}
                    <ArtworkCard.CardSubCategory>
                      {' '}
                      {subCategory}
                    </ArtworkCard.CardSubCategory>
                  </ArtworkCard.CardCategory>
                </ArtworkCard.CardCategoryInfo>

                <ArtworkCard.CardArtworkName>
                  {name.toUpperCase()}
                </ArtworkCard.CardArtworkName>

                <ArtworkCard.CardArtworkArtistName>
                  {artist?.name}
                </ArtworkCard.CardArtworkArtistName>

                <ArtworkCard.CardArtworkPice>
                  Price: {currency}
                  {renderPrice(price)}
                </ArtworkCard.CardArtworkPice>
              </ArtworkCard.FlexNestA>

              <ArtworkCard.FlexNestB>
                <ArtworkCard.PublishedOn>
                  {/* Published On */}
                  <ArtworkCard.PublishedText>
                    <div>Published On:</div>
                    <ArtworkCard.PublishedDate>
                      {format(new Date(registeredDate), 'MM/dd/yyyy')}
                    </ArtworkCard.PublishedDate>
                  </ArtworkCard.PublishedText>

                  {/* ======= Card link Group ======= */}
                  <ArtworkCard.CardLinkGroup>
                    <a href={`/admin/artworks/add`}>
                      <EditIcon width={18} height={18} />
                    </a>

                    {!isDeleted ? (
                      <div role="link" onClick={() => deleteArt(_id)}>
                        <DeleteIcon width={18} height={18} />
                      </div>
                    ) : null}
                  </ArtworkCard.CardLinkGroup>
                  {/* ======= End - Card link Group ======= */}

                  {/*  Edit Delete Button */}
                </ArtworkCard.PublishedOn>
              </ArtworkCard.FlexNestB>
            </ArtworkCard.FlexNest>
          </ArtworkCard.CardFlexB>
          {/* ======= End - FlexB ======= */}
        </ArtworkCard.CardFlex>
      </ArtworkCard.CardBody>
    </ArtworkCard.Card>
  );
}

ArtworkCard.Card = styled.div`
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;

ArtworkCard.CardBody = styled.div`
  flex: 1 1 auto;
  padding: 32px;
`;

/* ======= Flex =======  */
ArtworkCard.CardFlex = styled.div`
  @media (min-width: 768px) {
    display: flex;
  }

  > div:first-child {
    margin-right: 32px;
  }
`;

// Image
ArtworkCard.CardFlexA = styled.div`
  & > img {
    display: block;
    border-radius: 5px;
    background-color: #eee;
    width: 200px;
    height: 200px;
    margin: 0 auto ${rem(24)};
  }

  @media (min-width: 768px) {
    & > img {
      margin: 0;
    }
  }
`;

ArtworkCard.Dummy = styled.div`
  position: relative;
  display: block;
  border-radius: 5px;
  background-color: #868e96;
  width: 200px;
  height: 200px;
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

    font-size: ${rem(32)};
    color: #dee2e6;
  }

  @media (min-width: 768px) {
    & {
      margin: 0;
    }
  }
`;

// Right side information
ArtworkCard.CardFlexB = styled.div`
  flex-grow: 1;
`;

/* ======= End - Flex =======  */

ArtworkCard.CardImageWrap = styled.div``;

ArtworkCard.FlexNest = styled.div`
  display: flex;
  justify-content: space-between;
`;

ArtworkCard.FlexNestA = styled.div``;
ArtworkCard.FlexNestB = styled.div``;
/* ======= Side A =======  */

ArtworkCard.CardCategoryInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
`;

ArtworkCard.CardCategory = styled.span`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: 22px;
  font-weight: 600;
  color: #000;
`;

ArtworkCard.CardSubCategory = styled.span`
  font-size: 22px;
  font-weight: 600;
  color: #718898;
`;

ArtworkCard.CardArtworkName = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16px;
`;

ArtworkCard.CardArtworkArtistName = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #272b2f;
  margin-bottom: 16px;
`;

ArtworkCard.CardArtworkPice = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #272b2f;
  margin-bottom: 16px;
`;

/* ======= End - Side A =======  */

/* ======= Side B =======  */
ArtworkCard.PublishedOn = styled.div``;

ArtworkCard.PublishedText = styled.div`
  margin-bottom: 4px;
  text-align: center;
  > div {
    color: #1bb964;
  }

  > div:first-child {
    font-size: 14px;
    font-weight: 400;
  }
`;

ArtworkCard.PublishedDate = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

/* ======= End - Side B =======  */

/* ======= Link Group =======  */
ArtworkCard.CardLinkGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

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
`;

/* ======= End - Link Group =======  */

function renderPrice(price: string) {
  return parseInt(price).toFixed(2);
}
