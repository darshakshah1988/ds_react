import React from 'react';
import styled from 'styled-components';

import ContentNavbar from './ContentNavbar';
import ContentFooter from './ContentFooter';

type Props = {
  toggleIconMode: () => void;
  toggleMobileMode: () => void;
  children: React.ReactNode;
};

export default function SideContent(props: Props) {
  const { toggleIconMode, toggleMobileMode, children } = props;
  return (
    <SideContent.Wrapper>
      {/* ContentNavBar*/}
      <ContentNavbar
        toggleIconMode={toggleIconMode}
        toggleMobileMode={toggleMobileMode}
      />
      {/* ================== PageInjector Content ==================  */}
      {children}
      {/* ================== End -PageInjector Content ==================  */}
      {/* ContentFooter */}
      <ContentFooter />
    </SideContent.Wrapper>
  );
}

// Styles
SideContent.Wrapper = styled.div`
  & {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100vh;
  }

  @media (min-width: 992px) {
    & {
      margin-left: ${({ theme }) => theme.admin.sideNavWidth}px;
      transition: margin 0.25s ease;
    }
    /* Icon-mode */
    .icon-mode & {
      margin-left: 70px;
    }
  }
`;
