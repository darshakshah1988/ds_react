import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

const MarginBottom = styled.div<{
  $marginTop?: number;
  $marginBottom?: number;
}>`
  margin-top: ${({ $marginTop }) => ($marginTop ? `${rem($marginTop)}` : 0)};
  margin-bottom: ${({ $marginBottom }) =>
    $marginBottom ? `${rem($marginBottom)}` : 0};
`;

export default MarginBottom;
