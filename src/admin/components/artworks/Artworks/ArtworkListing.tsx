import { Fragment, useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { getDate, getYear, getMonth } from 'date-fns';

import ArtworkRenderer from './ArtworkRenderer';

import Breadcrumb from '../../reuseable/Breadcrumb';
import Skeleton from '../../reuseable/Skeleton';

import { IArtData } from '../../../types';
import { artService } from '../../../../services';
import Flexer from '../../styled/Flexer';
import Pagination from '../../../../components/filters/Pagination';
import FilterBasicTextField from '../../../../components/filters/FilterBasicTextField';
import FilterPriceDropdown from '../../../../components/filters/FilterPriceDropdown';
import FilterActiveDropdown from '../../../../components/filters/FilterActiveDropdown';
import FilterDateInput from '../../../../components/filters/FilterDateInput';
import FilterApplyButton from '../../../../components/filters/FilterApplyButton';

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
export default function ArtworkListing() {
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

  // 💣 ------------------ End - Filter states ------------------

  // ✅  ------------------ Filter functions ------------------

  // Text
  function onChangeHandler(e: any) {
    setText(e?.target?.value ? e.target.value : '');
  }

  // ActiveDropdown
  function onActiveHandler(behavior: string) {
    setApplyText(behavior);
  }

  function onPriceHandler(behavior: string) {
    setPriceText(behavior);
  }

  // Date
  function onSaleDate(date: any) {
    setSaleDate(date);
  }

  // Filter apply button
  function onApplyClick(e: any) {
    if (applyText === 'Active' && text.length > 0) {
      setLoading(true); // Start loading skeleton
      artService
        .getFreeSearchArts({ ...pagination, page: 1, filter: text })
        .then(function(response) {
          if (response?.data && response?.data.arts) {
            let results = filterByPrice(response?.data.arts, priceText);

            if (saleDate) {
              results = filterBySaleDate(results, saleDate.toString());
            }

            setArtworks(results);

            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(function(error) {
          setLoading(false);
        });
    }
    // Don't need to send filter requests
    else if (applyText === 'Active' && text.length === 0) {
      setLoading(true); // Start loading skeleton
      artService
        .getArts(pagination)
        .then(function(response) {
          if (response?.data && response?.data.arts) {
            let results = filterByPrice(response?.data.arts, priceText);

            if (saleDate) {
              results = filterBySaleDate(results, saleDate.toString());
            }

            setArtworks(results);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(function(error) {
          setLoading(false);
        });
    }
  }

  // 💣 ------------------ End - Filter functions ------------------

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
      <Flexer
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
            {/* Filter Group Elements */}
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
            {/* End - Filter Group Elements */}
          </ArtworkListing.FilterWrap>
        }
      />

      {!loading && Array.isArray(artworks) && artworks.length === 0 ? (
        <ArtworkListing.HeadingNotFound>
          Sorry, No records found
        </ArtworkListing.HeadingNotFound>
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

// Styled components

// FilterWrap
ArtworkListing.FilterWrap = styled.div``;

// Filter Group Styles
ArtworkListing.FilterGroup = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;

  > *:not(:last-child) {
    margin-right: 16px;
  }
`;

const InputStyles = css`
  width: 186px;
`;

const ActiveDropdownStyles = css`
  width: 96px;
`;

const PriceDropdownStyles = css`
  width: 122px;
`;

const DateInputStyles = css`
  width: 196px;
`;

// End - Filter Group Styles

ArtworkListing.HeadingNotFound = styled.h1`
  font-size: ${rem(18)};
  font-weight: 500;
  color: #000;
  margin-top: ${rem(32)};
  margin-bottom: 0;
`;

/**
 * This function basically filter the result based on price lowest to highest
 * @param data {Array<IArtData>} - Array of artworks
 * @param type {string} - Type of sorting you want to apply
 */
function filterByPrice(data: Array<IArtData>, type: string) {
  if (Array.isArray(data) && data.length > 0) {
    // Lowest to highest
    if (type === 'Price Low') {
      return data.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    }
    // Highest to lowest
    else if (type === 'Price High') {
      return data.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    }
  }

  return data;
}

/**
 * This function basically filter the result based on selected date
 * @param data
 * @param date
 */
function filterBySaleDate(data: Array<IArtData>, date: string) {
  if (Array.isArray(data) && data.length > 0 && date.length > 0) {
    // Get only those arts who have salesInfo property
    const salesInfo = data.filter(
      art => art?.salesInfo && art.salesInfo?.salesStartDate
    );

    if (Array.isArray(salesInfo) && salesInfo.length > 0) {
      const targetDate = new Date(date);
      const day = getDate(targetDate);
      const mon = getMonth(targetDate);
      const year = getYear(targetDate);

      return salesInfo.filter(art => {
        const saleDate = new Date(art.salesInfo.salesStartDate);
        const d = getDate(saleDate);
        const m = getMonth(saleDate);
        const y = getYear(saleDate);
        return d === day && m == mon && y === year;
      });
    }
  }
  return data;
}
