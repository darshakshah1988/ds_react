import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

import navlist from '../../constants/NavbarList';

// Component
export default function SideNav() {
  const { pathname } = useRouter();

  return (
    <SideNav.Box>
      {/* Black Box Shell */}
      <SideNav.BoxShell>
        {/* Logo*/}

        <SideNav.BrandWrap>
          <Link href="/admin" passHref>
            <SideNav.Brand>Chérie</SideNav.Brand>
          </Link>
          <SideNav.Text>NTF art marketplace</SideNav.Text>
        </SideNav.BrandWrap>

        <SideNav.BrandIconLogo>
          <Link href="/admin" passHref>
            C
          </Link>
        </SideNav.BrandIconLogo>

        {/*  List */}
        <SideNav.ListWrap>
          <SideNav.List>
            {navlist.map(({ id, path, text, icon: Icon }) => {
              return (
                <SideNav.ListItem key={id}>
                  <Link href={path} passHref>
                    <SideNav.ListElement
                      className={pathname === path ? 'active' : ''}
                    >
                      <Icon />
                      <span>{text}</span>
                    </SideNav.ListElement>
                  </Link>
                </SideNav.ListItem>
              );
            })}
          </SideNav.List>
        </SideNav.ListWrap>
      </SideNav.BoxShell>
    </SideNav.Box>
  );
}

// Styles
SideNav.Box = styled.div`
  & {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
    width: ${({ theme }) => theme.admin.sideNavWidth}px;
    transform: translateX(-${({ theme }) => theme.admin.sideNavWidth}px);
    transition: transform 0.25s ease, width 0.25s ease;
  }

  .mobile-mode & {
    transform: translateX(0);
  }

  @media (min-width: 992px) {
    & {
      transform: translateX(0);
    }
    /* Icon-mode */
    .icon-mode & {
      width: 70px;
    }
  }
`;

SideNav.BoxShell = styled.div`
  /* Represent our Shell Box */
  background-color: ${({ theme }) => theme.colors.text.black};
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-wrap: nowrap;
`;

// BrandWrap
SideNav.BrandWrap = styled.div`
  position: relative;
  text-align: center;
  padding: 18px 8px 10px; /* top, left-right, bottom*/
  margin-bottom: 42px;

  &:after {
    content: '';
    position: absolute;
    background-color: rgba(255, 255, 255, 16%);
    width: 90%;
    height: 1px;
    margin: 0 auto;
    bottom: 0;
    left: 0; /* Helps us to make Width 100% */
    right: 0; /* Helps us to make Width 100% */
  }

  /* Icon-mode */
  @media (min-width: 992px) {
    .icon-mode & {
      display: none;
    }
  }
`;

SideNav.Brand = styled.a`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: 32px;
  font-weight: 700;
  line-height: 0.9;
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  white-space: nowrap;
`;

SideNav.Text = styled.p`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 0;
`;

// ======= For IconMode Only =======
SideNav.BrandIconLogo = styled.div`
  @media (min-width: 992px) {
    & {
      display: none;
    }

    /* Icon-mode */
    .icon-mode & {
      display: block;
      padding: 8px;
      margin-bottom: 42px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 16%);
    }

    .icon-mode & > a {
      font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
      font-size: 48px;
      font-weight: 700;
      line-height: 0.9;
      color: ${({ theme }) => theme.colors.white};
      text-decoration: none;
      white-space: nowrap;
    }
  }
`;
// ======= End - For IconMode Only =======

// ListWrap Overflow Auto
SideNav.ListWrap = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

// List
SideNav.List = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  margin-bottom: auto;
  margin-left: 0;
  padding-left: 0;
  list-style: none;
`;

SideNav.ListItem = styled.li`
  position: relative;
  display: block;
  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

SideNav.ListElement = styled.a`
  
  & > svg {
    margin-right: 20px;
    width: 18px;
    height: 18px;
  }
  
  
  & {
    position: relative;
    color: ${({ theme }) => theme.colors.white};
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding: 8px 16px 8px 24px;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    z-index: 1;
  }
  
  &:after {
    content: '';
    height: 100%;
    width: 3px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: -1;
    background-color: ${({ theme }) => theme.colors.white};
    transform: scaleY(0);
    transition: transform 0.3s ease 0s;
  }

  /* Hover case */
  &:hover {
    :after {
      transform: scaleY(1);
    }
  }
  
}

  /* active case */
  &.active {
    :after {
      transform: scaleY(1);
    }
  }

/* Icon Mode */
@media (min-width: 992px) {
  .icon-mode & {
    justify-content: center;
    padding: 8px;
  }

  .icon-mode & > span {
    display: none;
  }

  .icon-mode & > svg {
    margin-right: 0;
    width: 24px;
    height: 24px;
  }
}
  
`;
