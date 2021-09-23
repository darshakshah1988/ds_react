import React from 'react';
import styled from 'styled-components';
import NavbarFront from '../layouts/parts/NavbarFront';
import FooterFront from '../layouts/parts/FooterFront';
import { MarketContainer } from '../layouts/parts/MarketContainer';



type Props = {
  username: string | null;
};

// Component
export default function Market() {
  return (
    <Market.Wrapper>
      <NavbarFront></NavbarFront>   
      <MarketContainer></MarketContainer>                     
      <FooterFront></FooterFront>
    </Market.Wrapper>
  );
}

Market.Wrapper = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
`;





