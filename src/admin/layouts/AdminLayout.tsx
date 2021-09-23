import React, { useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import SideNav from './parts/SideNav';
import SideContent from './parts/SideContent';

// Types
type Props = {
  children: React.ReactNode;
};

// Component
export default function AdminLayout(props: Props) {
  const { children } = props;

  // Here we can use Global state management for the Admin layout
  const [iconMode, setIconMode] = useState<boolean>(false);
  const [mobileMode, setMobileMode] = useState<boolean>(false);

  function toggleIconMode() {
    setIconMode(prev => !prev);
  }

  function toggleMobileMode() {
    setMobileMode(prev => !prev);
  }

  let Cls = classNames({
    'icon-mode': iconMode,
    'mobile-mode': mobileMode
  });

  return (
    <AdminLayout.Wrapper className={Cls}>
      {/*  Left Side */}
      <SideNav />
      {/* Right Side */}
      <SideContent
        toggleIconMode={toggleIconMode}
        toggleMobileMode={toggleMobileMode}
      >
        {children}
      </SideContent>
    </AdminLayout.Wrapper>
  );
}

AdminLayout.Wrapper = styled.main`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
