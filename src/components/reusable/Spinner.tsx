import styled, { keyframes } from 'styled-components';

// Types
type Props = {
  marginRight?: number;
};

// Component
export default function Spinner(props: Props) {
  const { marginRight } = props;
  return (
    <Spinner.Node $marginRight={marginRight} role="status" aria-hidden="true" />
  );
}

const spinner = keyframes`
  to { 
    transform: rotate(360deg);
  }
`;

Spinner.Node = styled.span<{ $marginRight?: number }>`
  & {
    display: inline-block;
    width: 32px;
    height: 32px;
    vertical-align: text-bottom;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${spinner} 0.75s linear infinite;
  }

  /* Small size */
  & {
    width: 16px;
    height: 16px;
    border-width: 3px;
  }

  & {
    margin-right: ${({ $marginRight }) =>
      $marginRight ? `${$marginRight}px` : '0'};
  }
`;
