import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';

type BreadcrumbData = {
  path: string;
  text: string;
};

// Type
type Props = {
  data: Array<BreadcrumbData>;
};

// Component
export default function Breadcrumb(props: Props) {
  const { data } = props;
  const len = data.length;
  const { pathname } = useRouter();

  return (
    <Fragment>
      {Array.isArray(data) && data.length > 0 ? (
        <Breadcrumb.Wrap aria-label="breadcrumb">
          <Breadcrumb.List>
            {data.map((item, index) => {
              if (index === len - 1) {
                return (
                  <Breadcrumb.ListItem key={`index-${index}`} className="last">
                    {item.text}
                  </Breadcrumb.ListItem>
                );
              } else {
                return (
                  <Breadcrumb.ListItem key={`index-${index}`}>
                    <Link href={item.path}>
                      <a>{item.text}</a>
                    </Link>
                  </Breadcrumb.ListItem>
                );
              }
            })}
          </Breadcrumb.List>
        </Breadcrumb.Wrap>
      ) : null}
    </Fragment>
  );
}

// Styles
Breadcrumb.Wrap = styled.nav`
  margin-bottom: 16px;
  @media (min-width: 576px) {
    margin-bottom: 0;
  }
`;

Breadcrumb.List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin-bottom: 0;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
`;

Breadcrumb.ListItem = styled.li`
  & + & {
    padding-left: 8px;
  }

  & + &:before {
    float: left;
    padding-right: 8px;
    color: #c0c9d7;
    content: '/';
  }

  &.last {
    color: #c0c9d7;
  }

  & > a {
    color: ${({ theme }) => theme.colors.functional.danger};
  }

  & > a:hover {
    color: ${({ theme }) => theme.colors.functional.danger};
  }
`;
