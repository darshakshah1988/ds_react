import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

export default function ContentProfileDropdown() {
  return (
    <ContentProfileDropdown.Wrap>
      <Link href="/admin" passHref>
        <ContentProfileDropdown.Button type="button">
          JD
        </ContentProfileDropdown.Button>
      </Link>
    </ContentProfileDropdown.Wrap>
  );
}

// Styles
ContentProfileDropdown.Wrap = styled.div``;

ContentProfileDropdown.Button = styled.a`
  & {
    position: relative;
    width: 42px;
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    font-size: 14px;
    font-weight: 500;
    padding: 4px;
    background-color: ${({ theme }) => theme.colors.text.lightGray};
    border: 0;
    border-radius: 50%;
    color: ${({ theme }) => theme.colors.white};
    z-index: 2;
  }

  @media (min-width: 992px) {
    :before {
      content: '';
      position: absolute;
      display: block;
      width: 48px;
      height: 48px;
      border: 5px solid #4e608e;
      border-radius: 50%;
      border-bottom-color: transparent;
      border-left-color: transparent;
      transform: rotate(135deg);
      z-index: 1;
    }
  }
`;
