import styled from 'styled-components';

export default function ContentFooter() {
  return (
    <ContentFooter.Wrapper>
      <ContentFooter.Copyright>
        © {new Date().getFullYear()} Chérie. All Rights Reserved
      </ContentFooter.Copyright>
    </ContentFooter.Wrapper>
  );
}

ContentFooter.Wrapper = styled.footer`
  background-color: #f7f7f9;
  padding: 8px 0;
  /* 
  Very important property it will place our footer always to the bottom
  whether viewport height is larger.
  */
  margin-top: auto;
`;

ContentFooter.Copyright = styled.p`
  font-weight: 500;
  font-size: 14px;
  color: #c0c9d7;
  text-align: center;
  margin: 0;
`;
