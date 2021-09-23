import React from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

// Types
type Props = {
  onClickHandler: (event: any) => void;
  disabled?: boolean;
  styled?: FlattenSimpleInterpolation;
};

// Component
export default function FilterApplyButton(props: Props) {
  const { onClickHandler, styled, disabled } = props;

  function onClick(e: any) {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (onClickHandler) {
      return onClickHandler(e);
    }
  }

  return (
    <FilterApplyButton.Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      $styled={styled}
    >
      Apply
    </FilterApplyButton.Button>
  );
}

// Styled
FilterApplyButton.Button = styled.button<{
  $styled?: FlattenSimpleInterpolation;
}>`
  & {
    display: inline-block;

    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    vertical-align: middle;

    cursor: pointer;
    user-select: none;

    padding: 12px 32px;
    border-radius: 9999px;

    border: 1px solid transparent;
    color: #ffffff;
    background-color: transparent;
  }

  & {
    border: 1px solid #4e608e;
    color: #ffffff;
    background-color: #4e608e;
    transition: opacity 0.3s ease;
  }

  &:hover {
    opacity: 0.8;
  }

  &&:disabled {
    pointer-events: none;
    opacity: 0.65;
  }

  ${props => {
    const { $styled } = props;
    if ($styled) {
      return css`
        ${$styled};
      `;
    }
  }};
`;
