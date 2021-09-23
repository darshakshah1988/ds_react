import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

// Props
type Props = {
  children: React.ReactNode;
};

export default function AddArtworkSubmitButtonWrapper(props: Props) {
  const { children } = props;
  return (
    <AddArtworkSubmitButtonWrapper.ButtonWrapper>
      {children}
    </AddArtworkSubmitButtonWrapper.ButtonWrapper>
  );
}

// Styles
AddArtworkSubmitButtonWrapper.ButtonWrapper = styled.div`
  & > div:not(:last-child) {
    margin-bottom: ${rem(16)};
  }

  @media (min-width: 1200px) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: nowrap;
    margin-top: ${rem(32)};

    & > div:not(:last-child) {
      margin-bottom: 0;
      margin-right: ${rem(16)};
    }
  }
`;
