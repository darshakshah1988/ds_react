import React, { Fragment } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { getIdentifyUserName } from '../../../helpers';
import Button from '../../reusable/Button';

export default function Navbar({ user }: any) {
  const username = getIdentifyUserName(user || null);

  return (
    <Navbar.Nav>
      <Navbar.Container>
        <Link href="/" passHref>
          <Navbar.Brand>Chérie</Navbar.Brand>
        </Link>
        <Navbar.Wrapper>
          {user ? (
            <Link href={`/users/${username}`} passHref>
              <CustomButtonB>My Profile</CustomButtonB>
            </Link>
          ) : (
            <Fragment>
              <Navbar.LinkGroup>
                <Link href="/signin" passHref>
                  <CustomButtonA>Sign in</CustomButtonA>
                </Link>

                <Link href="/signup" passHref>
                  <CustomButtonB>Sign up</CustomButtonB>
                </Link>
              </Navbar.LinkGroup>
            </Fragment>
          )}
        </Navbar.Wrapper>
      </Navbar.Container>
    </Navbar.Nav>
  );
}

// Styles
Navbar.Nav = styled.nav`
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

Navbar.Container = styled.div`
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

Navbar.Brand = styled.a`
  padding-top: 4px;
  padding-bottom: 4px;
  margin-right: 1rem;
  font-size: 32px;
  font-weight: bold;
  color: #000;
  text-decoration: none;
  white-space: nowrap;

  :hover {
    color: #000;
    text-decoration: none;
  }
`;

Navbar.Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

Navbar.LinkGroup = styled.div`
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
