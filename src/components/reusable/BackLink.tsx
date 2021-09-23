import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

// Types
type Props = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

// Component
export default function BackLink(props: Props) {
  const { children, onClick } = props;
  const router = useRouter();

  return (
    <BackLink.Wrapper
      role="button"
      tabIndex={0}
      aria-label="Logout button"
      onClick={onClick ? onClick : () => router.back()}
    >
      {children}
    </BackLink.Wrapper>
  );
}

BackLink.Wrapper = styled.div`
  display: inline-block;
  color: #333;

  &:hover {
    text-decoration: underline;
    color: #181818;
  }
`;
