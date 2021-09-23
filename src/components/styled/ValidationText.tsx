import React from 'react';
import styled from 'styled-components';

const ValidationText = styled.small<{
  $marginTop?: number;
  $marginBottom?: number;
  $fontWeight?: number;
  $width?: number;
}>`
  font-weight: ${({ $fontWeight }) => ($fontWeight ? $fontWeight : 400)};
  width: ${({ $width }) => ($width ? $width : 'auto')};
  color: #dc3545;
  margin-bottom: ${({ $marginBottom }) =>
    $marginBottom ? `${$marginBottom}px` : '4px'};
  margin-top: ${({ $marginTop }) => ($marginTop ? `${$marginTop}px` : '10px')};
  display: block;
`;

export default ValidationText;
