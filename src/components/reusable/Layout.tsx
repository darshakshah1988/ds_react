import React from 'react';
import styled from 'styled-components';

// Types
type Props = {
  children: React.ReactNode;
};

// Component
export default function Layout(props: Props) {
  const { children } = props;
  return <Layout.Wrapper>{children}</Layout.Wrapper>;
}

// Styles
Layout.Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
