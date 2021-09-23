import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'


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


export const MarketCard = (props:CardProps) => {
    return (
        <MarketCard.Wrapper>
                {
                    props.cardItems.map(prop=>(
                        <MarketCard.Card>
                            <MarketCard.Media>
                            <Image src={prop.image.src}height="300px" width="300" />
                            </MarketCard.Media>
                            <MarketCard.Body>
                                <MarketCard.Content>
                                    {prop.title}
                                </MarketCard.Content>

                                <MarketCard.ContentRed>
                                    {prop.ResidualQuality}
                                </MarketCard.ContentRed>
                            </MarketCard.Body>
                            </MarketCard.Card>
                    ))
                }
                

        </MarketCard.Wrapper>
    )
}


MarketCard.Card=styled.div`
    display: flex;
    width: 30%;
    margin-left: 10px;
    flex-direction: row;
    max-width: 300px;
    flex-wrap: wrap;
    margin-top: 20px;
    background-color: #F9F9F9;
    border-radius: 10px;
`;

MarketCard.Wrapper=styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;


MarketCard.Media=styled.div`  
   
    width: 100%;
    object-fit: cover;
    padding:0px;

`;


MarketCard.Body=styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: left;
    padding:10px;


`;
MarketCard.Content=styled.p`
    text-align: start;
    font-family: Poppins;
    font-size: 16px;
    margin: 0px;

`;
MarketCard.ContentRed=styled.p`
    text-align: start;
    font-family: Poppins;
    font-size: 16px;
    margin: 0px;
    color:  #FC6076;
`;


