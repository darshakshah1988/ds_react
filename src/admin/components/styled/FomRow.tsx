import React from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { rem } from 'polished';

// Types
type Props = {
  children: React.ReactNode;
  styled?: FlattenSimpleInterpolation;
};

export default function FormRow(props: Props) {
  const { children, styled } = props;

  return (
    <FormRow.Wrapper $styled={styled}>
      {React.Children.map(children, child => {
        return <div>{child}</div>;
      })}
    </FormRow.Wrapper>
  );
}

// Styles
FormRow.Wrapper = styled.div<{
  $marginBottom?: number;
  $styled?: FlattenSimpleInterpolation;
}>`
  display: flex;
  flex-wrap: wrap;
  margin-right: -12px;
  margin-left: -12px;

  & > div {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    padding-right: 12px;
    padding-left: 12px;
    margin-bottom: ${rem(20)};
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
