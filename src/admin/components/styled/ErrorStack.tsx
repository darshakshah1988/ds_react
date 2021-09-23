import React, { useState, useEffect } from 'react';
import { BsX } from 'react-icons/bs';
import styled from 'styled-components';
import { rem } from 'polished';

import { ErrorStackForArt } from '../../types';

// Props
type Props = {
  headingText: string;
  stack: Array<ErrorStackForArt>;
  children?: React.ReactNode;
};

// Component
export default function ErrorStack(props: Props) {
  const { headingText, stack, children } = props;

  // Set the visibility of the alert message
  const [visible, setVisible] = useState<boolean>(true);

  function closeToggle() {
    setVisible(false);
  }

  useEffect(() => {
    if (visible) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [visible]);

  return visible && Array.isArray(stack) && stack.length > 0 ? (
    <ErrorStack.Wrapper>
      <ErrorStack.Heading>{headingText}</ErrorStack.Heading>
      <ErrorStack.List>
        {stack.map((error, index) => {
          return (
            <li key={`error-${index}`}>
              <ErrorStack.Statement>
                {error.message.statement}
              </ErrorStack.Statement>

              <ErrorStack.Reason>{error.message.reason}</ErrorStack.Reason>
            </li>
          );
        })}
      </ErrorStack.List>

      {children}

      <ErrorStack.Button onClick={closeToggle}>
        <BsX width={16} height={16} />
      </ErrorStack.Button>
    </ErrorStack.Wrapper>
  ) : null;
}

// Styled
ErrorStack.Wrapper = styled.div`
  position: relative;
  padding: ${rem(18)} ${rem(24)};
  margin-bottom: ${rem(40)};
  border: 1px solid transparent;
  border-radius: 0.25rem;
  & {
    color: #664d03;
    background-color: #fff3cd;
    border-color: #ffecb5;
  }
`;

ErrorStack.Heading = styled.h1`
  font-size: ${rem(20)};
  font-weight: 500;
  line-height: 1.2;
  color: #664d03;
  margin-bottom: ${rem(16)};
`;

ErrorStack.List = styled.ul`
  padding-left: 0;
  list-style: none;
  margin-bottom: 0;
  > li:not(:last-child) {
    margin-bottom: ${rem(16)};
  }
`;

ErrorStack.Statement = styled.p`
  font-size: ${rem(14)};
  font-weight: 500;
  line-height: 1.2;
  color: #664d03;
  margin-bottom: ${rem(8)};
`;

ErrorStack.Reason = styled.span`
  display: block;
  font-size: ${rem(12)};
  color: #664d03;
`;

// Close Button
ErrorStack.Button = styled.button`
  & {
    width: 24px;
    height: 24px;
    padding: 4px;
    color: #000;
    border: 0;
    border-radius: 50%;
  }

  & {
    position: absolute;
    top: 8px;
    right: 14px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & {
    color: #000;
    background-color: transparent;
    border-color: transparent;
  }
`;
