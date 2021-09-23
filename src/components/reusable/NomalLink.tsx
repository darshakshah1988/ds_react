import React from 'react';
import styled from 'styled-components';

// Types
// `onClick`, `href`, and `ref` need to be passed to the DOM element
// for proper handling
type ForwardProps = {
  children: React.ReactNode;
  onClick?: any;
  href?: string;
};

// Component
// eslint-disable-next-line react/display-name
const NormalLink = React.forwardRef<any, ForwardProps>((props, ref) => {
  const { onClick, href, children } = props;
  return (
    <Anchor href={href} onClick={onClick} ref={ref}>
      {children}
    </Anchor>
  );
});

export default NormalLink;

// Styles
const Anchor = styled.a`
  display: inline-block;
  font-size: 18px;
  color: #3f51b5;
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  text-decoration: underline;
  transition: opacity 0.1s ease;

  &:hover {
    opacity: 0.9;
  }
`;
