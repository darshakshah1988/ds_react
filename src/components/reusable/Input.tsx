import React from 'react';
import styled, { css } from 'styled-components';

// Types
type InputTypes = 'text' | 'email' | 'password';

type Props = {
  type: InputTypes;
  invalid?: boolean | undefined;
  [index: string]: any;
};

// Component
export default function Input(props: Props) {
  const { type, invalid, RHFRef, ...attrs } = props;
  return <Input.Field type={type} $invalid={invalid} {...attrs} {...RHFRef} />;
}

type StyledProps = {
  $invalid: boolean | undefined;
};

Input.Field = styled.input<StyledProps>`
  display: block;
  width: 100%;
  padding: 12px 14px;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  height: 50px;
  color: #212529;
  background-color: #fff;
  border: 2px solid #c5c5c5;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 4px;
  transition: border-color 0.3s ease-in-out;

  &:focus {
    color: #212529;
    background-color: #fff;
    border-color: #272b2f;
    outline: 0;
  }

  &::-webkit-input-placeholder {
    color: #c0c9d7;
    opacity: 1;
  }
  &::-moz-placeholder {
    color: #c0c9d7;
    opacity: 1;
  }
  &::placeholder {
    color: #c0c9d7;
    opacity: 1;
  }

  ${props => {
    const { $invalid } = props;
    if ($invalid) {
      return css`
        &:invalid,
        && {
          border-color: #dc3545;
        }
        &:invalid:focus,
        &&:focus {
          border-color: #dc3545;
        }
      `;
    } else {
      return css``;
    }
  }}
`;
