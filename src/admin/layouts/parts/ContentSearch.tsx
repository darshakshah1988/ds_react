import React from 'react';
import styled from 'styled-components';

import { SearchIcon } from '../../svgs';

// Component
export default function Search() {
  return (
    <Search.Wrapper>
      <Search.Input type="text" placeholder="Search..." autoComplete="off" />
      <Search.Icon>
        <SearchIcon width={14} height={14} />
      </Search.Icon>
    </Search.Wrapper>
  );
}

// Styles
Search.Wrapper = styled.div`
  position: relative;
  width: 350px;
  display: none;
  @media (min-width: 992px) {
    display: block;
  }
`;

Search.Input = styled.input`
  display: block;
  width: 100%;
  padding: 12px 14px;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  height: 38px;
  color: ${({ theme }) => theme.colors.text.black};
  background-color: #f5f4f4;

  border-radius: 5px;
  border: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:focus {
    color: ${({ theme }) => theme.colors.text.black};
    background-color: #f5f4f4;
    border: 0;
    outline: 0;
  }

  &::-webkit-input-placeholder {
    color: #d4d4d4;
  }
  &::-moz-placeholder {
    color: #d4d4d4;
  }
  &::placeholder {
    color: #d4d4d4;
  }

  & {
    padding-left: 40px;
  }
`;

Search.Icon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 4px 16px;
  color: #aaa;
`;
