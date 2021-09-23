import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';



type Props = {
  username: string | null;
};

// Component
export default function HomeIntro(props: Props) {
  const { username } = props;
  return (
    <HomeIntro.Wrapper>
      <HomeIntro.Heading>Chérie</HomeIntro.Heading>
      <HomeIntro.Subtitle>NFT art marketplace</HomeIntro.Subtitle>

      {username ? (
        <Link href={`/users/${username}`} passHref>
          <HomeIntro.StyledLink>Go to My Profile</HomeIntro.StyledLink>
        </Link>
      ) : (
        <Link href="/signup" passHref>
          <HomeIntro.StyledLink>Sign Up with Email</HomeIntro.StyledLink>
        </Link>
      )}
    </HomeIntro.Wrapper>
  );
}



HomeIntro.Wrapper = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 296px;
  padding-left: 12px;
  padding-right: 12px;
`;

HomeIntro.Heading = styled.h1`
  font-size: 78px;
  color: #272b2f;
  margin: 0;
  line-height: 1;
`;

HomeIntro.Subtitle = styled.p`
  font-size: 24px;
  color: #718898;
  margin-bottom: 12px;
`;

HomeIntro.StyledLink = styled.a`
  
  & {
    width: 100%;
    border-radius: 4px;
    padding: 8px 16px;
  }

  & {
    color: #fff;
    background-color: #272b2f;
    border-color: #272b2f;
  }

  &:hover {
    color: #fff;
    background-color: #37393b;
    border-color: #37393b;
  }

  &:focus {
    color: #fff;
    background-color: #37393b;
    border-color: #37393b;
  }

  &:active {
    color: #fff;
    background-color: #060708;
    border-color: #060708;
  }
`;
