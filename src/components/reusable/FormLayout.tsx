import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { rem } from 'polished';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { getAuthFormOverlay } from '../../redux/slices/layoutSlice';

type Props = {
  children: React.ReactNode;
};

export default function FormLayout(props: Props) {
  const { children } = props;

  const authFormOverlay = useSelector(getAuthFormOverlay);

  return (
    <FormLayout.Wrapper>
      <FormLayout.Container>
        <FormLayout.Row>
          {/* ============= Left Column ============= */}
          <FormLayout.ColA>
            <FormLayout.LeftSideHeight>
              <FormLayout.LeftSideHeightBody>
                {/* ============= Width ============= */}
                <FormLayout.LeftWidth>
                  <FormLayout.TitleWrapper>
                    <Link href="/" passHref>
                      <FormLayout.BrandLogo>Chérie</FormLayout.BrandLogo>
                    </Link>
                    <FormLayout.Subtitle>
                      NTF art marketplace
                    </FormLayout.Subtitle>
                  </FormLayout.TitleWrapper>

                  {/* ============= Dynamic Content ============= */}
                  {children}
                  {/* ============= End - Dynamic Content ============= */}
                </FormLayout.LeftWidth>
                {/* ============= End - Width =============  */}
              </FormLayout.LeftSideHeightBody>
            </FormLayout.LeftSideHeight>
            {/* ============= FormOverlay =============  */}

            {authFormOverlay ? <FormLayout.Overlay aria-hidden="true" /> : null}
            {/* ============= End - FormOverlay =============  */}
          </FormLayout.ColA>
          {/* ============= End - Left Column ============= */}

          {/* ============= Right Column ============= */}
          <FormLayout.ColB>
            <FormLayout.RightSideHeight>
              <FormLayout.RightSideHeightBody>
                <FormLayout.RightWidth>
                  <FormLayout.RightImageWrap>
                    <Image
                      layout="responsive"
                      src="/auth/auth.png"
                      alt="Chérie Welcome Screen"
                      width={376}
                      height={262}
                    />
                  </FormLayout.RightImageWrap>

                  <FormLayout.RightHeading>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </FormLayout.RightHeading>

                  <FormLayout.RightDescription>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Quisque elit arcu, tristique et consequat sed, sodales vitae
                    leo.
                  </FormLayout.RightDescription>
                </FormLayout.RightWidth>
              </FormLayout.RightSideHeightBody>
            </FormLayout.RightSideHeight>
          </FormLayout.ColB>
          {/* ============= End - Right Column ============= */}
        </FormLayout.Row>
      </FormLayout.Container>
    </FormLayout.Wrapper>
  );
}

// Styles

const COLUMN_GAP = 24;
FormLayout.Wrapper = styled.div``;

FormLayout.Container = styled.div`
  width: 100%;
  padding-right: ${COLUMN_GAP}px;
  padding-left: ${COLUMN_GAP}px;
  margin-right: auto;
  margin-left: auto;
`;

FormLayout.Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -${COLUMN_GAP}px;
  margin-left: -${COLUMN_GAP}px;
`;

FormLayout.Col = styled.div`
  & {
    position: relative;
    width: 100%;
    padding-right: ${COLUMN_GAP}px;
    padding-left: ${COLUMN_GAP}px;
  }
`;

FormLayout.ColA = styled(FormLayout.Col)`
  & {
    flex: 0 0 100%;
    max-width: 100%;
  }

  @media (min-width: 1200px) {
    flex: 0 0 60%;
    max-width: 60%;
  }
`;

FormLayout.ColB = styled(FormLayout.Col)`
  & {
    position: fixed;
    top: 0;
    right: 0;
    flex: 0 0 40%;
    max-width: 40%;
    display: none;
  }

  & {
    padding-right: 0;
  }

  @media (min-width: 1200px) {
    display: block;
  }
`;

FormLayout.Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  background-color: rgb(255, 255, 255, 0.22);
`;

FormLayout.LeftSideHeight = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

FormLayout.LeftSideHeightBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 96px 0;
`;

FormLayout.LeftWidth = styled.div`
  width: 646px;
  margin-left: auto;
  margin-right: auto;
`;

// ============= Titles =============
FormLayout.TitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

FormLayout.BrandLogo = styled.a`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-weight: 700;
  font-size: ${rem(50)};
  color: ${({ theme }) => theme.colors.black};
  display: inline-flex;
  line-height: 0.9;
  margin-bottom: 8px;
`;

FormLayout.Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-weight: 400;
  font-size: ${rem(24)};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 0;
`;

// ============= End - Titles =============

// ============= Right Column =============
FormLayout.RightSideHeight = styled.div`
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #272b2f;
`;

FormLayout.RightSideHeightBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  padding: 96px 0;
`;

FormLayout.RightWidth = styled.div`
  width: 332px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

FormLayout.RightImageWrap = styled.div`
  margin-bottom: 32px;

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    mix-blend-mode: luminosity;
  }
`;

FormLayout.RightHeading = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: 24px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 12px;
`;

FormLayout.RightDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 0;
`;

// ============= End - Right Column =============
