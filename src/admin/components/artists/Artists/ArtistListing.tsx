import { Fragment, useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import cookie from 'js-cookie';
import { rem } from 'polished';

import Breadcrumb from '../../reuseable/Breadcrumb';
import Skeleton from '../../reuseable/Skeleton';
import ArtistRenderer from './ArtistRenderer';
import { GridIcon, ListIcon } from '../../../svgs';

import { artistService } from '../../../../services';
import { IArtistData } from '../../../types';
import Flexer from '../../styled/Flexer';
import AddLink from '../../styled/AddLink';
import Pagination from '../../../../components/filters/Pagination';
import FilterBasicTextField from '../../../../components/filters/FilterBasicTextField';
import FilterActiveDropdown from '../../../../components/filters/FilterActiveDropdown';
import FilterApplyButton from '../../../../components/filters/FilterApplyButton';

// Types
type DisplayMode = 'grid' | 'list';

// Pagination settings
const PAGE_NO = 1;
const LIMIT_PER_PAGE = 10;

const PAGINATION = {
  page: PAGE_NO,
  limit: LIMIT_PER_PAGE,
  sort: {},
  filter: { isDeleted: false }
};

// Component
export default function ArtistListing() {
  const [display, setDisplay] = useState<DisplayMode>('list'); // Default display of the result

  const [artists, setArtists] = useState<Array<IArtistData>>([]); // Get data
  const [loading, setLoading] = useState<boolean>(true); // Loading

  const [total, setTotal] = useState<number>(0); // Note: Total number of records help us to count how many links will be generate in pagination

  // Pagination Query
  const [pagination, setPagination] = useState(PAGINATION);

  // Populate pagination stored settings on cookie
  const [populatePagination, setPopulatePagination] = useState(PAGINATION);

  // This determine to make future calls
  const networkReady = useRef(false);

  // Filter Apply Text InActive or Active for the dropdown
  const [applyText, setApplyText] = useState<string>('InActive');

  // Filter Input Text
  const [text, setText] = useState<string>('');

  // ✅ ChangeDisplayMode
  function changeDisplayMode(mode: DisplayMode) {
    setDisplay(mode);
  }

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
    setApplyText('InActive');
  }

  // ✅ HandleInputChange
  function onChangeHandler(e: any) {
    setText(e?.target?.value ? e.target.value : '');
  }

  // ✅ HandleDropdownChange
  function onDropdownHandler(behavior: string) {
    setApplyText(behavior);
  }

  // ✅ HandleOnApplyFilters
  function onApplyClick(e: any) {
    if (applyText === 'Active' && text.length > 0) {
      setLoading(true); // Start loading skeleton
      artistService
        .getFreeSearchArtists({ ...pagination, page: 1, filter: text })
        .then(function(response) {
          if (response?.data && response?.data.artists) {
            setArtists(response?.data.artists);
            setLoading(false);
          }
        })
        .catch(function(error) {
          setLoading(false);
        });
      // Don't need to send filter requests
    } else if (applyText === 'Active' && text.length === 0) {
      setLoading(true); // Start loading skeleton
      artistService
        .getArtists(pagination)
        .then(function(response) {
          if (response?.data && response?.data.artists) {
            // On page refresh apply pagination settings
            cookie.set('pagination', JSON.stringify(pagination)); // store the pagination settings in cookie

            setArtists(response?.data.artists); // Display artists
            setLoading(false);
            //  window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        })
        .catch(function(error) {
          setLoading(false);
        });
    }
  }

  // ✅  Hook: 1 - Cookies Storage Values access
  useEffect(() => {
    const pagination = cookie.get('pagination'); // Get the Pagination
    if (pagination) {
      setPopulatePagination(JSON.parse(pagination));
    }
  }, []);

  // ✅  Hook: 2 -useEffect to fetch artists
  useEffect(() => {
    let isCancelled = false;

    const getArtists = async () => {
      try {
        const response = await artistService.getCount(PAGINATION);
        // Check how many records we have in the database
        if (response?.data && response.data?.count > 0) {
          // Make sure isCancelled is false
          if (!isCancelled) {
            setTotal(response.data?.count); // Set the total number of records

            const pagination = cookie.get('pagination'); // Get the pagination
            // Now we are ready to getAll all our records and make a network call
            await artistService
              .getArtists(pagination ? pagination : PAGINATION)
              .then(function(response) {
                if (response?.data && response?.data.artists) {
                  if (!isCancelled) {
                    setArtists(response?.data.artists); // Display artists

                    setLoading(false);
                    networkReady.current = true; // Make this persistent to true
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

    getArtists();
  }, []);

  //✅  Hook: 3 - Whenever pagination state will change we have to send the request to the server
  useEffect(() => {
    let isCancelled = false;

    function loadNewDataFromServer() {
      setLoading(true); // Start loading skeleton
      artistService
        .getArtists(pagination)
        .then(function(response) {
          if (response?.data && response?.data.artists) {
            if (!isCancelled) {
              // On page refresh apply pagination settings
              cookie.set('pagination', JSON.stringify(pagination)); // store the pagination settings in cookie

              setArtists(response?.data.artists); // Display artists
              setLoading(false);
              //  window.scrollTo({ top: 0, behavior: 'smooth' });
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
              { path: '', text: 'Artist Listing' }
            ]}
          />
        }
        rightNode={<AddLink href="/admin/artists/add">Add New Artist</AddLink>}
      />

      {/*  Filter Wrap */}
      <ArtistListing.FilterWrap>
        {/* ItemA */}
        <ArtistListing.FilterWrapItemA>
          <ArtistListing.SpanGap>Artist Listing</ArtistListing.SpanGap>
          <ArtistListing.ButtonIconGroup>
            <ArtistListing.IconButton
              type="button"
              className={display === 'grid' ? 'active' : ''}
              onClick={() => changeDisplayMode('grid')}
            >
              <GridIcon />
            </ArtistListing.IconButton>
            <ArtistListing.IconButton
              type="button"
              className={display === 'list' ? 'active' : ''}
              onClick={() => changeDisplayMode('list')}
            >
              <ListIcon />
            </ArtistListing.IconButton>
          </ArtistListing.ButtonIconGroup>
        </ArtistListing.FilterWrapItemA>
        {/* End - ItemA */}

        {/* ItemB */}
        <ArtistListing.FilterWrapItemB>
          {/* Filter Group Elements */}
          <ArtistListing.FilterGroup>
            <FilterBasicTextField
              value={text}
              styled={InputStyles}
              placeholder="Filter By Name"
              onChange={onChangeHandler}
            />
            <FilterActiveDropdown
              styled={DropdownStyles}
              value={applyText}
              onDropdownChanger={onDropdownHandler}
            />
            <FilterApplyButton
              disabled={applyText === 'InActive'}
              onClickHandler={onApplyClick}
            />
          </ArtistListing.FilterGroup>

          {/* End - Filter Group Elements */}
        </ArtistListing.FilterWrapItemB>
        {/* End - ItemB */}
      </ArtistListing.FilterWrap>

      {!loading && Array.isArray(artists) && artists.length === 0 ? (
        <ArtistListing.HeadingNotFound>
          Sorry, No records found
        </ArtistListing.HeadingNotFound>
      ) : null}

      {/* ================== Artist Renderer ==================  */}
      {loading ? (
        <Skeleton />
      ) : (
        <ArtistRenderer artists={artists} display={display} />
      )}
      {/* ================== End - Artist Renderer ==================  */}

      {/* ================== Pagination ==================  */}
      {Array.isArray(artists) && artists.length > 0 ? (
        <Pagination
          initialPage={
            populatePagination?.page ? populatePagination.page - 1 : 0
          }
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
ArtistListing.FilterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// ItemA contains Heading and Buttons
ArtistListing.FilterWrapItemA = styled.div``;

ArtistListing.SpanGap = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.black};
  margin-right: 24px;
`;

ArtistListing.ButtonIconGroup = styled.span`
  display: inline-flex;
  align-items: center;
  flex-direction: row;

  & > :not(:last-child) {
    margin-right: 12px;
  }
`;

ArtistListing.IconButton = styled.button`
  & {
    width: 48px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    padding: 4px;
    background-color: transparent;
    border: 1px solid #eee;
    border-radius: 2px;
    color: ${({ theme }) => theme.colors.functional.primary};
    transition: border-color 0.1s ease-in, color 0.1s ease-in;
  }

  &.active {
    color: ${({ theme }) => theme.colors.functional.danger};
    border-color: #ffe2e4;
  }
  > svg {
    width: 14px;
    height: 14px;
  }
`;

// ItemB contains Filtration components
ArtistListing.FilterWrapItemB = styled.div``;
// End - ItemB contains Filtration components

// Filter Group Styles
ArtistListing.FilterGroup = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;

  > *:not(:last-child) {
    margin-right: 16px;
  }
`;

const InputStyles = css`
  width: 220px;
`;

const DropdownStyles = css`
  width: 148px;
`;

// End - Filter Group Styles

ArtistListing.HeadingNotFound = styled.h1`
  font-size: ${rem(18)};
  font-weight: 500;
  color: #000;
  margin-top: ${rem(32)};
  margin-bottom: 0;
`;
