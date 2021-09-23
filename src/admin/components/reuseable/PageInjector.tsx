import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

type Props = {
  children: React.ReactNode;
  bottomGap?: number;
};

export default function PageInjector(props: Props) {
  const { children, bottomGap } = props;
  return (
    <PageInjector.Wrapper $bottomGap={bottomGap}>
      {children}
    </PageInjector.Wrapper>
  );
}

PageInjector.Wrapper = styled.div<any>`
  padding: ${rem(48)} ${rem(40)}
    ${({ $bottomGap }) => ($bottomGap ? rem($bottomGap) : rem(48))} ${rem(40)};
  width: 100%;
  margin: 0 auto;
`;
