import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import cookie from 'js-cookie';

import { resetUser } from '../../../redux/slices/authSlice';

// Types
type Props = {
  children: React.ReactNode;
};

// Component
export default function LogoutLink(props: Props) {
  const { children } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  async function logout() {
    cookie.remove('token'); // clear auth token cookie
    dispatch(resetUser()); // reset the redux store
    await router.push('/'); // push to the main page
  }

  return (
    <LogoutLink.Wrapper
      role="button"
      tabIndex={0}
      aria-label="Logout button"
      onClick={logout}
    >
      {children}
    </LogoutLink.Wrapper>
  );
}

LogoutLink.Wrapper = styled.div`
  display: inline-block;
  color: #333;

  &:hover {
    text-decoration: underline;
    color: #181818;
  }
`;
