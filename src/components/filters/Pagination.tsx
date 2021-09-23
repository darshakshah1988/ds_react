import styled from 'styled-components';
import { rem } from 'polished';
import ReactPaginate from 'react-paginate';

// Props
type Props = {
  pageCount: number; // The total number of pages.
  initialPage?: number;
  onPageChange: (selectedItem: { selected: number }) => void; // The method to call when a page is clicked. Exposes the current page object as an argument.
};

// Component
export default function Pagination(props: Props) {
  const { pageCount, onPageChange, initialPage } = props;
  return (
    <Pagination.Wrap>
      <ReactPaginate
        initialPage={initialPage ? initialPage : 0}
        pageCount={pageCount}
        pageRangeDisplayed={10}
        marginPagesDisplayed={0}
        previousLabel={<PreviousIcon width={8} height={8} />}
        nextLabel={<NextIcon width={8} height={8} />}
        breakLabel={'...'}
        breakClassName="break-me"
        onPageChange={onPageChange}
        containerClassName="pagination"
        activeClassName="active"
        pageLinkClassName="page-link"
        previousLinkClassName="previous-link"
        nextLinkClassName="next-link"
      />
    </Pagination.Wrap>
  );
}

// Svg Components
function NextIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M1.924 1.012c.541 0 1.08.228 1.461.671l4.34 5.064a1.923 1.923 0 010 2.506l-4.34 5.064a1.924 1.924 0 01-2.921-2.505L3.731 8 .464 4.189a1.923 1.923 0 011.46-3.177z"
      />
      <path
        fill="currentColor"
        d="M9.734 1.012c.542 0 1.081.228 1.462.671l4.341 5.064a1.925 1.925 0 010 2.506l-4.341 5.064a1.924 1.924 0 01-2.922-2.505L11.542 8 8.273 4.189a1.924 1.924 0 011.461-3.177z"
      />
    </svg>
  );
}

// PreviousIcon
function PreviousIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14.076 14.988c-.541 0-1.08-.228-1.461-.671l-4.34-5.064a1.923 1.923 0 010-2.506l4.34-5.064a1.924 1.924 0 012.921 2.505L12.269 8l3.267 3.811a1.923 1.923 0 01-1.46 3.177z"
      />
      <path
        fill="currentColor"
        d="M6.266 14.988a1.924 1.924 0 01-1.462-.671L.463 9.253a1.925 1.925 0 010-2.506l4.341-5.064a1.924 1.924 0 012.922 2.505L4.458 8l3.268 3.811a1.924 1.924 0 01-1.46 3.177z"
      />
    </svg>
  );
}

// ------------------ Styled ----------------------
Pagination.Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: ${rem(16)} 0;

  /* Pagination unordered list */
  & .pagination {
    display: flex;
    margin: 0;
    padding-left: 0;
    list-style: none;
    border-radius: 0.25rem;
  }
  /* Normal a elements */
  & .page-link,
  & .break-me {
    position: relative;
    display: block;

    padding: 8px 12px;
    margin-left: -1px;

    font-size: 14px;

    color: #272b2f;
    background-color: #fff;
    border: 1px solid #dee2e6;

    user-select: none;
    cursor: pointer;

    &:hover {
      color: #fc686f;
    }
  }

  /* Just Previous */
  & .previous-link {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  /* Just Next */
  & .next-link {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  /* Previous and Next */
  & .previous-link,
  & .next-link {
    position: relative;
    display: block;

    padding: 8px 24px;
    margin-left: -1px;

    font-size: 14px;

    color: #272b2f;
    background-color: #fff;
    border: 1px solid #dee2e6;

    user-select: none;
    cursor: pointer;
  }

  & li.active .page-link {
    color: #fc686f;
  }

  & li.disabled .previous-link,
  & li.disabled .next-link {
    opacity: 0.4;
    cursor: not-allowed;
  }

  & li:not(.disabled) .previous-link:hover,
  & li:not(.disabled) .next-link:hover {
    color: #fc686f;
  }
`;
// ------------------ End - Styled ----------------------
