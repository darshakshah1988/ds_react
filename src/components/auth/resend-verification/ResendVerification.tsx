import { useState } from 'react';
import styled from 'styled-components';

import { authService } from '../../../services';
import { ServerResponseMessageStatus } from '../../../types';
import Alert from '../../reusable/Alert';

export default function ResendVerification(props: {
  email: string;
  verificationMessage: string;
}) {
  const { email, verificationMessage } = props;

  const [
    serverSideSuccess,
    setServerSideSuccess
  ] = useState<ServerResponseMessageStatus | null>(null);

  // resendVerificationLink function
  function resendVerificationLink() {
    authService
      .resendVerificationLink({ email: email || '' })
      .then(function(response) {
        setServerSideSuccess(response);
      })
      .catch(function() {});
  }

  return (
    <>
      {serverSideSuccess?.message ? (
        <Alert color="success">{serverSideSuccess.message}</Alert>
      ) : (
        <Alert color="danger">
          {verificationMessage}{' '}
          <ResendVerification.Link
            role="button"
            onClick={resendVerificationLink}
          >
            Resend verification link.
          </ResendVerification.Link>
        </Alert>
      )}
    </>
  );
}

ResendVerification.Link = styled.div`
  & {
    display: inline-flex;
    font-weight: 500;
    text-decoration: underline;
    opacity: 1;
    transition: opacity 0.3s linear;
  }

  &:hover {
    opacity: 0.7;
  }
`;
