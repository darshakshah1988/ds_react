import React from 'react';
import { Fragment } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { AdminFormInputStyles } from '../../styles/reuse';

// Types
type InputTypes = 'text' | 'email';

type Props = {
  type: InputTypes;
  id: string;
  label?: boolean;
  labelText?: string | React.ReactNode;
  RHFRef: any;
  invalid?: boolean | undefined;
  [prop: string]: any;
};

export default function AdminFormInput(props: Props) {
  const {
    type,
    id,
    label,
    labelText,
    labelSubText,
    invalid,
    RHFRef,
    ...attrs
  } = props;

  if (label) {
    return (
      <Fragment>
        <AdminFormInput.Label htmlFor={id}>{labelText}</AdminFormInput.Label>
        <AdminFormInput.Input
          type={type}
          id={id}
          $invalid={invalid}
          {...attrs}
          {...RHFRef}
        />
      </Fragment>
    );
  }

  return (
    <AdminFormInput.Input
      type={type}
      id={id}
      $invalid={invalid}
      {...attrs}
      {...RHFRef}
    />
  );
}

AdminFormInput.Label = styled.label`
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #718898;
  margin-bottom: ${rem(8)};
  user-select: none;
`;

AdminFormInput.Input = styled.input<{ $invalid?: boolean }>`
  ${AdminFormInputStyles};
`;
