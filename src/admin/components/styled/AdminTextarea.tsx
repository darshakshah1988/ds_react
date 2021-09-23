import { Fragment } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { AdminFormInputStyles } from '../../styles/reuse';

// Types
type Props = {
  id: string;
  labelText: string;
  RHFRef: any;
  label?: boolean;
  invalid?: boolean | undefined;
  height?: number;
  [prop: string]: any;
};

export default function AdminTextarea(props: Props) {
  const { id, label, labelText, invalid, height, RHFRef, ...attrs } = props;

  if (label) {
    return (
      <Fragment>
        <AdminTextarea.Label htmlFor={id}>{labelText}</AdminTextarea.Label>
        <AdminTextarea.Textarea
          id={id}
          $invalid={invalid}
          $height={height}
          {...attrs}
          {...RHFRef}
        />
      </Fragment>
    );
  }

  return (
    <AdminTextarea.Textarea
      id={id}
      $invalid={invalid}
      $height={height}
      {...attrs}
      {...RHFRef}
    />
  );
}

AdminTextarea.Label = styled.label`
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #718898;
  margin-bottom: ${rem(8)};
`;

AdminTextarea.Textarea = styled.textarea<{ $height?: number }>`
  ${AdminFormInputStyles};
  & {
    height: ${({ $height }) => ($height ? `${$height}px` : '136px')};
  }
`;
