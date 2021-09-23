import React, { Fragment } from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { rem } from 'polished';
import { useForm } from 'react-hook-form';

// Types
type Props = {
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  styled?: FlattenSimpleInterpolation;
};

// This component are controlled from the parent component.
export default function FilterBasicTextField(props: Props) {
  const { value, placeholder, onChange, styled } = props;

  const formOptions = {
    defaultValues: { field: value || '' }
  };

  const { register } = useForm<{ field: string }>(formOptions);

  return (
    <Fragment>
      <FilterBasicTextField.Input
        {...register('field')}
        type="text"
        autoComplete="off"
        placeholder={placeholder || ''}
        onChange={onChange}
        $styled={styled}
      />
    </Fragment>
  );
}

FilterBasicTextField.Input = styled.input<{
  $styled?: FlattenSimpleInterpolation;
}>`
  display: block;

  width: 100%;

  padding: ${rem(12)} ${rem(14)};

  font-size: ${rem(14)};
  line-height: 1.5;

  color: #212529;
  background-color: #fff;
  border: 1px solid #eee;

  border-radius: 4px;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:focus {
    outline: 0;
    border-color: #ddd;
  }

  &::-webkit-input-placeholder {
    color: #8a92a6;
  }
  &::-moz-placeholder {
    color: #8a92a6;
  }
  &::placeholder {
    color: #8a92a6;
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
