import React from 'react';
import styled from 'styled-components';

import Navbar from './parts/Navbar';
import Footer from './parts/Footer';

// Types
type Props = {
  user: any;
  children: React.ReactNode;
};

// Component
export default function Layout(props: Props) {
  const { user, children } = props;

  return (
    <>
      <Navbar user={user} />
      <Layout.Main>{children}</Layout.Main>
      <Footer />
    </>
  );
}

Layout.Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px 0;
`;
