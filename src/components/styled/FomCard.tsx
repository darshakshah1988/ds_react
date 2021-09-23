import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

// Props
type Props = {
  children: React.ReactNode;
  [key: string]: any;
};

// Component
export default function FormCard(props: Props) {
  const { children, ...attrs } = props;
  return (
    <FormCard.Card {...attrs}>
      <FormCard.Body>{children}</FormCard.Body>
    </FormCard.Card>
  );
}

// styled
FormCard.Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 15px 5px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  margin-bottom: 24px;
`;
FormCard.Body = styled.div`
  padding: ${rem(40)} ${rem(40)} ${rem(20)} ${rem(40)};
`;
