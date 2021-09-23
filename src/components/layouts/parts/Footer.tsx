import styled from 'styled-components';

export default function Footer() {
  return (
    <Footer.Wrapper>
      <Footer.Copyright>
        Copyright © Chérie.com {new Date().getFullYear()}
      </Footer.Copyright>
    </Footer.Wrapper>
  );
}

Footer.Wrapper = styled.footer`
  background-color: #272b2f;
  padding: 24px 0;
`;

Footer.Copyright = styled.p`
  text-align: center;
  margin: 0;
  font-size: 14px;
  color: #fff;
`;
