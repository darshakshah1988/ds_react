import { Fragment } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import Link from 'next/link';

import NormalLink from '../../reusable/NomalLink';

// Types
type Props = {
  message: string;
};

export default function VerifyEmailMessage(props: Props) {
  const { message } = props;

  return (
    <Fragment>
      {/* ============= Message ============= */}
      <VerifyEmailMessage.Heading>{message}</VerifyEmailMessage.Heading>
      <Link href="/signin" passHref>
        <NormalLink>Click here to proceed further</NormalLink>
      </Link>
      {/* ============= End - Message ============= */}
    </Fragment>
  );
}

// Styles
VerifyEmailMessage.Heading = styled.h1`
  font-size: ${rem(30)};
  font-weight: 700;
  margin-bottom: ${rem(8)};
  line-height: 1.2;
`;
