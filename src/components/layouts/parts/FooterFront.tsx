import styled from 'styled-components';
import Image from 'next/image'


export default function Footer() {
  return (
    <Footer.Wrapper>
      <Footer.Container>
      <Footer.Branding>
          <Footer.Brand>
            <Footer.BrandingTitle>Chérie</Footer.BrandingTitle>
            <Footer.BrandingDes>NFT art marketplace</Footer.BrandingDes>
          </Footer.Brand>
          

          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ornare placerat leo, ac varius dui varius in. Vestibulum id efficitur eros.  </div>

          <div>Download On App Store</div>

          <Footer.StoreImage>
            <Image src="/playstore.png" height="30px"width="90px"></Image>
            <Image src="/googleplaystore.svg" height="30px"width="90px"></Image>
          </Footer.StoreImage>
      </Footer.Branding>
      
      
      <Footer.Links>
        <Footer.LinkTitle>
          Links
        </Footer.LinkTitle>
        <Footer.LinkChild>
            <Footer.UL>
                <Footer.LI>Home  </Footer.LI>
                <Footer.LI>About Us</Footer.LI>
                <Footer.LI>Store</Footer.LI>
                <Footer.LI>Marketplace</Footer.LI>
            </Footer.UL>

            <Footer.LinkChild>
              <Footer.UL>
                      <Footer.LI>Contact Us  </Footer.LI>
                      <Footer.LI>News</Footer.LI>
                      <Footer.LI>Terms & Condition</Footer.LI>
                      <Footer.LI>Privacy Policy</Footer.LI>

                </Footer.UL>
        </Footer.LinkChild>

         </Footer.LinkChild>
      </Footer.Links>
      <Footer.SocialLinks>
        Social Links
        <Footer.SocialLinksIcons>
          <Footer.SocialIcon>
            <Image src="/soc1.png" height="20px"width="20px"></Image>           
          </Footer.SocialIcon>
         
          <Footer.SocialIcon>
            <Image src="/soc2.png" height="20px"width="20px"></Image>
          </Footer.SocialIcon>

        </Footer.SocialLinksIcons>

        
        
        <Footer.SubsCribe>Subscribe to our newsletter</Footer.SubsCribe>


        <Footer.SubscribeField>
            <Footer.SubscribeInput type="text" placeholder="Enter Email Address"/>
            <Footer.SubscribeFieldBtn >
              Subscribe
            </Footer.SubscribeFieldBtn>
        </Footer.SubscribeField>

      </Footer.SocialLinks>


      </Footer.Container>

      <Footer.Copyright>
        Copyright © Chérie.com {new Date().getFullYear()}
      </Footer.Copyright>
    </Footer.Wrapper>
  );
}

Footer.Wrapper = styled.footer`
  background-color: #272b2f;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
 
  align-items: center;

`;

Footer.Copyright = styled.p`
  text-align: center;
  margin: 0;
  font-size: 14px;
  color: #fff;
`;


Footer.Container=styled.div`
    display: flex;
    flex-direction:row;
    color:#fff;
    flex-wrap: wrap;
    text-align: left;
    padding: 10px;
    max-width: 1144px;
    display: flex;
    align-items: flex-start;
    justify-content: center;


`;

Footer.Branding=styled.div`
  max-width: 40%;

`;


Footer.Links=styled.div`
  display: flex;
  flex-direction: column;
  margin-top:25px;

`;

Footer.SocialLinks=styled.div`
  margin-top: 25px;
  margin-left: 20px;
  

`;

Footer.BrandingTitle=styled.p`
  padding-top: 4px;
  padding-bottom: 0px;
  margin-right: 1rem;
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  letter-spacing: 0.08em;
  margin-bottom: 0rem;

`;

Footer.BrandingDes=styled.p`
box-sizing: border-box;
margin-top: 0;
margin-bottom: 1rem;
width: 184px;
height: 21px;
left: 373px;
top: 2px;
font-family: Montserrat;
font-style: normal;
font-weight: 300;
font-size: 12px;
line-height: 1px;
color: #ffffff;
padding-top: 0px;
padding-bottom: 4px;

`;

Footer.Brand=styled.div`
  width: auto;
  display: inline-block;
  


`
Footer.SocialLinksIcons=styled.div`
  margin-left: 10px;
  margin-top: 25px;
  display: flex;
  
  
 

`;

Footer.StoreImage=styled.div`
  margin-top: 12px;

`;

Footer.SubscribeField=styled.div`
        margin-left: 10px;
        position: relative;

`
Footer.SubscribeFieldBtn=styled.button`        
        width: 76px;
        font-size: 12px;
        position: absolute;
        top: 0;
        border-radius: 15px;
        right: 0px;
        z-index: 2;
        border: none;
        top: 2px;
        height: 30px;
        cursor: pointer;
        color: white;
        background-color: #FC6076;
        transform: translateX(2px);

`;

Footer.SubscribeInput=styled.input`
        padding: 10px;
        position: relative;
        top: 0;
        border-radius: 15px;
        right: 0px;
        z-index: 2;
        border: none;
        top: 2px;
        height: 30px;       
        cursor: pointer;
        color: black;
        font-size: 12px;        
        transform: translateX(2px);
        width: 200px;

`;


Footer.LinkChild=styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 10px;
   

`;

Footer.LinkTitle=styled.div`
  margin-left: 10px;
`;

Footer.UL=styled.ul`
  list-style-type: none;
  padding-left: inherit;
  margin-top: 20px;

`;
Footer.SubsCribe=styled.p`
   margin-left: 10px;

`;

Footer.LI=styled.li`
  margin-top: 5px;
`;

Footer.SocialIcon=styled.div`
    margin-right: 8px;
 

`;

