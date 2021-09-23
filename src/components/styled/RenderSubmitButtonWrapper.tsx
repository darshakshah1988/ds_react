import React, { Fragment } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { rem } from 'polished';

import FormSubmitButton from '../styled/FormSubmitButton';

// Props
type Props = {
  attachTextWithLink: string;
  linkPath: string;
  linkText: string;
  buttonIcon: React.ReactNode;
  buttonText: string;
  buttonDisable: boolean;
};

// Component
export default function RenderSubmitButtonWrapper(props: Props) {
  const {
    attachTextWithLink,
    linkPath,
    linkText,
    buttonIcon,
    buttonText,
    buttonDisable
  } = props;

  return (
    <Fragment>
      <RenderSubmitButtonWrapper.TextWrapper>
        {/* ============= Text ============= */}

        <span>
          {attachTextWithLink}
          <Link href={linkPath} passHref>
            <RenderSubmitButtonWrapper.Link>
              {linkText}
            </RenderSubmitButtonWrapper.Link>
          </Link>
        </span>

        {/* ============= Submit Button ============= */}
        <FormSubmitButton
          text={buttonText}
          disabled={buttonDisable}
          icon={buttonIcon}
        />
      </RenderSubmitButtonWrapper.TextWrapper>
    </Fragment>
  );
}

// Styled
RenderSubmitButtonWrapper.TextWrapper = styled.div`
  text-align: center;

  > span {
    display: block;
    margin-bottom: ${rem(12)};
  }

  > span {
    font-size: 18px;
    color: #646464;
    font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  }

  > span > a {
    margin-left: 8px;
  }

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > span {
      display: inline;
      margin-bottom: 0;
    }
  }
`;

RenderSubmitButtonWrapper.Link = styled.a`
  font-size: 18px;
  color: #3f51b5;
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  text-decoration: underline;
`;
