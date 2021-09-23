import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import Div from '../../../components/styled/Div';

// Props
type Props = {
  leftNode: React.ReactNode;
  rightNode?: React.ReactNode;
};

// Component
export default function Flexer(props: Props) {
  const { leftNode, rightNode } = props;
  let JSX = null;

  if (rightNode) {
    JSX = (
      <Flexer.Flex>
        <Flexer.FlexItemA>{leftNode}</Flexer.FlexItemA>
        <Flexer.FlexItemB>{rightNode}</Flexer.FlexItemB>
      </Flexer.Flex>
    );
    return JSX;
  }

  return <Div $marginBottom={40}>{leftNode}</Div>;
}

// Styled
Flexer.Flex = styled.div`
  margin-bottom: ${rem(40)};
  @media (min-width: 576px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
`;

Flexer.FlexItemA = styled.div`
  margin-bottom: ${rem(24)};
  @media (min-width: 576px) {
    margin-bottom: 0;
  }
`;

Flexer.FlexItemB = styled.div``;
