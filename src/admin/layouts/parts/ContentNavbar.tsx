import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';

import ContentSearch from './ContentSearch';
import ContentProfileDropdown from './ContentProfileDropdown';
import { HandleIcon, RightHandleIcon, CloseIcon } from '../../svgs';

// Types
type Props = {
  toggleIconMode: () => void;
  toggleMobileMode: () => void;
};

// Component
export default function ContentNavbar(props: Props) {
  const { toggleIconMode, toggleMobileMode } = props;
  const [closeMobileIcon, setCloseMobileIcon] = useState<boolean>(false);

  function handleMobileMode() {
    setCloseMobileIcon(prev => !prev);
    toggleMobileMode();
  }

  return (
    <ContentNavbar.Wrapper>
      <ContentNavbar.Container>
        {/*   Flex */}
        <ContentNavbar.Flex>
          {/* Secret Logo */}

          {/*  Item 1*/}
          <ContentNavbar.FlexItemA>
            <Link href="/admin" passHref>
              <ContentNavbar.SecretLogo>Chérie</ContentNavbar.SecretLogo>
            </Link>

            <ContentNavbar.ButtonA
              type="button"
              onClick={() => toggleIconMode()}
            >
              <HandleIcon width={18} height={18} />
            </ContentNavbar.ButtonA>

            {/* AdminSearch */}
            <ContentSearch />
          </ContentNavbar.FlexItemA>

          {/* Item 2*/}
          <ContentNavbar.FlexItemB>
            <ContentNavbar.ButtonB type="button" onClick={handleMobileMode}>
              {closeMobileIcon ? (
                <CloseIcon width={18} height={18} />
              ) : (
                <RightHandleIcon width={18} height={18} />
              )}
            </ContentNavbar.ButtonB>

            <ContentProfileDropdown />
          </ContentNavbar.FlexItemB>

          {/* End Flex */}
        </ContentNavbar.Flex>
      </ContentNavbar.Container>
    </ContentNavbar.Wrapper>
  );
}

// Styles
ContentNavbar.Wrapper = styled.div`
  & {
    padding: 12px 0;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.03);
  }
`;

ContentNavbar.Container = styled.div`
  & {
    padding-left: 24px;
    padding-right: 24px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
`;

ContentNavbar.Flex = styled.div`
  & {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

// FlexItemA
ContentNavbar.FlexItemA = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  & > a {
    margin-right: 24px;
  }
  & > button {
    margin-right: 24px;
  }
`;

ContentNavbar.SecretLogo = styled.a`
  font-size: 32px;
  font-weight: 700;
  line-height: 0.9;
  color: ${({ theme }) => theme.colors.text.black};
  text-decoration: none;
  white-space: nowrap;

  @media (min-width: 992px) {
    display: none;
  }
`;

const ButtonIconStyle = css`
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  padding: 4px;
  background-color: transparent;
  border: 0;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.text.lightGray};
`;

ContentNavbar.ButtonA = styled.button`
  & {
    display: none;
  }
  @media (min-width: 992px) {
    & {
    ${ButtonIconStyle};
  }
`;

ContentNavbar.FlexItemB = styled.div`
  display: flex;
  align-items: center;

  & > button {
    margin-right: 12px;
  }
`;

ContentNavbar.ButtonB = styled.button`
  & {
    ${ButtonIconStyle};
  }
  @media (min-width: 992px) {
    & {
      display: none;
    }
  }
`;
