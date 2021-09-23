import React, { Fragment } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { getIdentifyUserName } from '../../../helpers';
import Button from '../../reusable/Button';

export default function NavbarShop({ user }: any) {
  const username = getIdentifyUserName(user || null);

  return (
    <NavbarShop.Nav>
      <NavbarShop.Container>
        <NavbarShop.logoWrap>
        <Link href="/" passHref>
          <NavbarShop.Brand>Chérie</NavbarShop.Brand>
        </Link>
        <NavbarShop.BrandTagLine>NFT art marketplace</NavbarShop.BrandTagLine>
        </NavbarShop.logoWrap>
        <NavbarShop.Menu>
          <Link href='/' passHref><NavbarShop.MenuLink>Home</NavbarShop.MenuLink></Link>
          <Link href='/store' passHref><NavbarShop.MenuLink>Store</NavbarShop.MenuLink></Link>
          <Link href='/market' passHref><NavbarShop.MenuLink>Marketplace</NavbarShop.MenuLink></Link>
          <Link href='/' passHref><NavbarShop.MenuLink>Contact Us</NavbarShop.MenuLink></Link>
          <Link href='/' passHref><NavbarShop.MenuLink>About Us</NavbarShop.MenuLink></Link>
          <Link href='/' passHref><NavbarShop.MenuLink>News</NavbarShop.MenuLink></Link>
        </NavbarShop.Menu>
      </NavbarShop.Container>
    </NavbarShop.Nav>
  );
}

// Styles
NavbarShop.Nav = styled.nav`
  background-color: #fff;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f3f3;
`;

NavbarShop.Container = styled.div`
  display: flex;
  flex-wrap: inherit;
  align-items: center;
  justify-content: space-between;

  max-width: 1140px;
  width: 100%;
  padding-right: 12px;
  padding-left: 12px;
  margin-right: auto;
  margin-left: auto;
`;
NavbarShop.logoWrap = styled.div`
  width:auto;
`;


NavbarShop.Brand = styled.a`
  padding-top: 4px;
  padding-bottom: 0px;
  margin-right: 1rem;
  font-size: 32px;
  font-weight: bold;
  color: #000;
  text-decoration: none;
  white-space: nowrap;
  letter-spacing: 0.08em;

  :hover {
    color: #000;
    text-decoration: none;
  }
`;
NavbarShop.BrandTagLine = styled.p`
width: 184px;
height: 21px;
left: 373px;
top: 2px;
font-family: Montserrat;
font-style: normal;
font-weight: 300;
font-size: 12px;
line-height: 1px;
color: #000000;
padding-top: 0px;
padding-bottom: 4px;
`;

NavbarShop.Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

NavbarShop.Menu = styled.div`
width: 604px;
height: 24px;
left: 950px;
top: 42px;
font-family: Poppins;
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 24px;
/* identical to box height */
text-align: right;
color: #1D1D1D;
`;

NavbarShop.MenuLink = styled.p`
float:left;
margin:10px;
line-height:12px;
font-family: Poppins;
font-style: normal;
font-weight: 500;

:hover {
  text-decoration:underline;
  color:orange;
}

:active {
  color:orange;
}`;

NavbarShop.LinkGroup = styled.div`
  & > a:not(:last-child) {
    margin-right: 8px;
  }
`;

// Pass Nxt.js Link props to our custom component Button
// eslint-disable-next-line react/display-name
const CustomButtonA = React.forwardRef<any, any>((props, ref) => {
  return <Button tag="a" transparent="secondary" role="button" {...props} />;
});

// eslint-disable-next-line react/display-name
const CustomButtonB = React.forwardRef<any, any>((props, ref) => {
  return <Button tag="a" color="secondary" role="button" {...props} />;
});
