import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { BsX } from 'react-icons/bs';

import { AlertColorType } from '../../types';
import ClientOnlyPortal from './ClientOnlyPortal';

// Types
type Props = {
  color?: AlertColorType;
  children?: React.ReactNode;
};

// Component
export default function Alert(props: Props) {
  const { color = 'success', children } = props;
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    if (visible) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [visible]);

  return visible ? (
    <ClientOnlyPortal selector="#a-01">
      <Alert.Wrapper $color={color} role="alert">
        {children}
        <Alert.Button type="button" onClick={() => setVisible(false)}>
          <BsX width={16} height={16} />
        </Alert.Button>
      </Alert.Wrapper>
    </ClientOnlyPortal>
  ) : null;
}

// Styles
type AlertWrapper = {
  $color: AlertColorType;
};

Alert.Wrapper = styled.div<AlertWrapper>`
  position: relative;
  padding: 16px 64px 16px 12px;
  font-size: 14px;
  text-align: center;
  z-index: 9999;

  ${props => {
    const { $color } = props;
    if ($color === 'success') {
      return css`
        & {
          color: #52c41a;
          background-color: #f6ffed;
          border-color: #f6ffed;
        }
      `;
    } else if ($color === 'danger') {
      return css`
        & {
          color: #f5222d;
          background-color: #fff1f0;
          border-color: #fff1f0;
        }
      `;
    } else {
      return css``;
    }
  }}
`;

Alert.Button = styled.button`
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
    top: 50%;
    right: 32px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-50%);
  }

  & {
    color: #000;
    background-color: #f8f9fa;
    border-color: #f8f9fa;
  }

  &:hover {
    color: #000;
    background-color: #e2e6ea;
    border-color: #e2e6ea;
  }

  &:focus {
    color: #000;
    background-color: #e2e6ea;
    border-color: #e2e6ea;
  }

  &:active {
    color: #000;
    background-color: #dae0e5;
    border-color: #dae0e5;
  }
`;
