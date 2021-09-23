import React, {Fragment, useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import NavbarFront from '../layouts/parts/NavbarFront';
import FooterFront from '../layouts/parts/FooterFront';
import { CardContainer } from '../layouts/parts/CardContainer';
import ArtworkRenderer from '../../admin/components/artworks/Artworks/ArtworkRenderer';
import { artService } from '../../services/artService'
import { IArtData } from '../../admin/types/artTypes';
import Flexer from '../../admin/components/styled/Flexer';
import Breadcrumb from '../../admin/components/reuseable/Breadcrumb';
import Skeleton from '../../admin/components/reuseable/Skeleton';
import Pagination from '../filters/Pagination';
// export interface IArtData {
//   _id: string;
//   fileUrl: string;
//   currency: string;
//   category: string;
//   subCategory: string;
//   name: string;
//   price: string;
//   registeredDate: string;
//   artist: {
//     name: string;
//     [property: string]: any;
//   };
//   [property: string]: any;
// }

type Props = {
  username: string | null;
};
const artworks = Array();


// Pagination settings
const PAGE_NO = 1;
const LIMIT_PER_PAGE = 10;

const PAGINATION = {
  page: PAGE_NO,
  limit: LIMIT_PER_PAGE,
  sort: {},
  filter: { isDeleted: false }
  // filter: {}
};

// Component
export default function Store() {
  const [artworks, setArtworks] = useState<Array<IArtData>>([]); // Get data
  const [loading, setLoading] = useState<boolean>(true); // Loading

  const [total, setTotal] = useState<number>(0); // Note: Total number of records help us to count how many links will be generate in pagination

  // Pagination Query
  const [pagination, setPagination] = useState(PAGINATION);

  // This determine to make future calls
  const networkReady = useRef(false);

  // ✅  ------------------ Filter states ------------------

  // Filter Input Text
  const [text, setText] = useState<string>('');

  // Filter by price
  const [priceText, setPriceText] = useState<string>('Price Low');

  // Filter Apply Text InActive or Active for the dropdown
  const [applyText, setApplyText] = useState<string>('InActive');

  // Filter Sale Date
  const [saleDate, setSaleDate] = useState<Date | null | undefined>(null);

  
  // ✅ HandlePageClicked
  function handlePageClicked(selectedItem: { selected: number }) {
    const { selected } = selectedItem;
    const offset = selected + 1; // Careful index 0 represent first page.

    // Update the page number
    setPagination(prev => {
      return { ...prev, page: offset };
    });

    // Reset the text, dropdown & button
    setText('');
    setPriceText('Price Low');
    setApplyText('InActive');
  }

  // ✅  Hook: 1 - useEffect to fetch artworks
  useEffect(() => {
    let isCancelled = false;

    const getArts = async () => {
      try {
        const response = await artService.getCount(PAGINATION);
        // Check how many records we have in the database
        if (response?.data && response.data?.count > 0) {
          // Make sure isCancelled is false
          if (!isCancelled) {
            setTotal(response.data?.count); // Set the total number of records

            // Now we are ready to getAll all our records and make a network call
            await artService
              .getArts(PAGINATION)
              .then(function(response) {
                if (response?.data && response?.data.arts) {
                  if (!isCancelled) {
                    setArtworks(response?.data.arts); // Display artists

                    setLoading(false);
                    networkReady.current = true; // Make this persistent to true
                  }
                } else {
                  if (!isCancelled) {
                    setLoading(false);
                  }
                }
              })
              .catch(function(error) {
                if (!isCancelled) {
                  setLoading(false);
                }
              });
          }
        } else {
          if (!isCancelled) {
            setLoading(false);
          }
        }
      } catch (e) {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    getArts();
  }, []);

  //✅  Hook: 2 - Whenever pagination state will change we have to send the request to the server
  useEffect(() => {
    let isCancelled = false;

    function loadNewDataFromServer() {
      setLoading(true); // Start loading skeleton
      artService
        .getArts(pagination)
        .then(function(response) {
          if (response?.data && response?.data.arts) {
            if (!isCancelled) {
              setArtworks(response?.data.arts); // Display artists
              setLoading(false);
              //  window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else {
            if (!isCancelled) {
              setLoading(false);
            }
          }
        })
        .catch(function(error) {
          if (!isCancelled) {
            setLoading(false);
          }
        });
    }

    if (networkReady.current) {
      loadNewDataFromServer();
    }
  }, [pagination]);

  return (
    <Fragment>
      {/* <Flexer
        leftNode={
          <Breadcrumb
            data={[
              { path: '/admin', text: 'Dashboard' },
              { path: '', text: 'Artwork' }
            ]}
          />
        }
        rightNode={
          <ArtworkListing.FilterWrap>
            <ArtworkListing.FilterGroup>
              <FilterBasicTextField
                value=""
                styled={InputStyles}
                placeholder="Filter By Name"
                onChange={onChangeHandler}
              />

              <FilterPriceDropdown
                styled={PriceDropdownStyles}
                value={priceText}
                onDropdownChanger={onPriceHandler}
              />

              <FilterActiveDropdown
                styled={ActiveDropdownStyles}
                value={applyText}
                onDropdownChanger={onActiveHandler}
              />

              <FilterDateInput
                id="filer-by-sales"
                styled={DateInputStyles}
                placeholder="Filter By Sales Date"
                onChange={onSaleDate}
              />

              <FilterApplyButton
                disabled={applyText === 'InActive'}
                onClickHandler={onApplyClick}
              />
            </ArtworkListing.FilterGroup>
          </ArtworkListing.FilterWrap>
        }
      /> */}

      {!loading && Array.isArray(artworks) && artworks.length === 0 ? (
        <Store.HeadingNotFound>
          Sorry, No records found
        </Store.HeadingNotFound>
      ) : null}

      {/* ================== Artwork Renderer ==================  */}

      {loading ? <Skeleton /> : <ArtworkRenderer artworks={artworks} />}

      {/* ================== End - Artwork Renderer ==================  */}

      {/* ================== Pagination ==================  */}
      {Array.isArray(artworks) && artworks.length > 0 ? (
        <Pagination
          pageCount={Math.ceil(total / LIMIT_PER_PAGE)}
          onPageChange={handlePageClicked}
        />
      ) : null}
      {/* ================== End - Pagination ==================  */}
    </Fragment>
  );
}

Store.Wrapper = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
`;
Store.HeadingNotFound = styled.p`
color:red;
font-size:12pt;
`;




