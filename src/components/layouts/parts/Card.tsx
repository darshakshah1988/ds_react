import React, { useState } from 'react'
import styled from 'styled-components';
import Image from 'next/image';



export interface CardImage{
    src:string;
    alt:string;
}

export interface CardData {
    status?: 'sold' | 'onSale';
    title?: string; 
    Holders?: string;
    SalesRate?:string;
    ResidualQuality?:string; 
    PublishDate?:string;
    image:CardImage; 
}
export interface CardProps{
    cardItems:CardData[];
}


export const Card = (props:CardProps) => {   
      
    return (   
        
        <Card.FullCard>
           {props.cardItems.map(prop=>(
              <Card.Wrapper >
              <Card.Media>
                   <Image src={prop.image.src}  layout="fill" />
                   
                   
                   {
                    prop.status==="sold" ? <Card.ButtonStatus>Sold</Card.ButtonStatus> : <Card.Button>On Sale</Card.Button>
                   }
   
               </Card.Media>
               <Card.Content>
                   <Card.TopContent>
                   <Card.Title>
                       {prop.title}
                   </Card.Title>
   
                   <Card.Details>
                       
                   </Card.Details>
   
                   <Card.Details>
                       Sales Rate: {prop.SalesRate}
                   </Card.Details>
                   
                   <Card.Details>
                      Residual Qualtity:{prop.ResidualQuality}
                   </Card.Details>
                   
                   <Card.Details>
                      Publish Date: {prop.PublishDate}
                   </Card.Details>
   
                   </Card.TopContent>
                   <Card.ContentBottom>
                       <Card.Action>
                           10 Likes
                       </Card.Action>
   
                       <Card.Action>
                           38 comments
                       </Card.Action>
   
                   </Card.ContentBottom>
   
                   <Card.Seperator/>
                   
                   <Card.ContentBottom>
                       <Card.Action>
                           <Card.BottomButton> <img src="/Like.svg" alt="An SVG of an eye" />  Like</Card.BottomButton>
                       </Card.Action>
   
                       <Card.Action>
                           <Card.BottomButton><img src="/Comment.svg" alt="An SVG of an eye" />  Comment</Card.BottomButton>
                       </Card.Action>
   
                   </Card.ContentBottom>
                   
   
   
                  
               </Card.Content>
          </Card.Wrapper>

           ))}
                    
       </Card.FullCard>
        
       
    )
}

Card.Wrapper = styled.div`    
    display: flex;    
    text-align: left;
    margin-top : 20px ;
    margin-bottom: 20px;
    background-color: #F9F9F9;  
   
    flex-direction:column;
    min-height: 500px;
    width: 30%;
    border-radius:10px ;
    align-items: left;
    margin-left: 10px;
  
  
`;

Card.Button=styled.button`
   
    position:absolute;
    margin-top: 5px;
    margin-right: 5px;
    top: 0;
    right: 0;   
    color: #1BB964;
    font-size: 12px;
    border-radius: 15px;
    border: none;

`;

Card.ButtonStatus=styled.button`
   
    position:absolute;
    margin-top: 5px;
    margin-right: 5px;
    top: 0;
    right: 0;   
    color: #FC686F;
    font-size: 12px;
    border-radius: 15px;
    border: none;

`;





Card.Media = styled.div`
    position: relative;
    flex: 50%;
    width: 100%;
    object-fit: cover;
    padding:0px;
  
`;

Card.Content = styled.div`
    margin-top: 10px;
   margin: 10px 10px 10px 10px;
   
  
`;

Card.Title = styled.div`
    margin-bottom: 10px;
    font-weight: 400px;
  
`;

Card.Details = styled.p`
    font-family: Poppins;
    font-size: 16px;
    margin: 0px;
  
`;

Card.Action=styled.div`
    flex: 50;


`;
Card.Seperator=styled.hr`
    border-top: 8px  #EAEAEA;
    border-radius: 5px;

`;
Card.ContentBottom=styled.div`
    display: flex;
    margin-top: 10px;
   
`;

Card.TopContent=styled.div`
    padding: 10px;


`;

Card.FullCard=styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    flex-direction: row;
    max-width: 100%;
    flex-wrap: wrap;
   

`;


Card.BottomButton=styled.button`
    background-color: #F9F9F9;
    border: none;
    text-align: center;
     text-decoration: none;
     padding: 10px ;
     

`;




