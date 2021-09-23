
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import Pagination from '../../filters/Pagination';
import { MarketCard } from './MarketCard';
import Arts from '../../../admin/constants/Arts';
import {TradionalArts} from '../../../admin/constants/Arts';
import FilterApplyButton from '../../filters/FilterApplyButton';
import FilterPriceDropdown from '../../filters/FilterPriceDropdown';
import styled from 'styled-components';
import FilterDateInput from '../../filters/FilterDateInput';
import FilterBasicTextField from '../../filters/FilterBasicTextField';
import { FilterDatePickerStyles } from '../../filters/filter-react-datepicker-styles';

const PageCount= Arts.length;
const PageSecCount=TradionalArts.length;


export const MarketContainer = () => {
    const [change,setChange]=useState(false);
    const [nftPage,setNftpage]=useState(false);


    const [data]=useState(Arts);  
    const [currentPage,setCurrentPage]=useState(1);    
    const [postPerPage]=useState(12);
    const indexOfLastPost=currentPage * postPerPage;
    const indexOfFirstPost=indexOfLastPost- postPerPage;
    const currentData=data.slice(indexOfFirstPost,indexOfLastPost)   
    
    
    const [dataSec]=useState(TradionalArts);      
    const [currentSecondPage,setCurrentSecondPage]=useState(1); 
    const [postPerSecPage]=useState(12);
    const indexOfLastPostSec=currentSecondPage * postPerSecPage;
    const indexOfFirstPostSec=indexOfLastPostSec- postPerPage; 
    const seconPagiData=dataSec.slice(indexOfFirstPostSec,indexOfLastPostSec);


    useEffect(() => {     
    },[currentData,nftPage]);

    function handlePageClicked(number:any){
        setCurrentPage(number.selected+1);
        setCurrentSecondPage(number.selected+1);
       
    }
    function onClickNFT(){
        setChange(true);   
        setNftpage(false); 
        
    }
    function onClickTraditional(){
        setChange(false);
        setNftpage(true); 
        
        
    }

    

    function onClickApply(){


    }

    return (
        <MarketContainer.Wrapper>
            <MarketContainer.Filter>
               <MarketContainer.FilterLeft>
                    <FilterBasicTextField styled={[]} value={ ""} placeholder={"Search By Type or Name" } onChange={onClickApply}></FilterBasicTextField>
                    <MarketContainer.Image>
                        <Image src="/SearchIcon.svg" width="20px" height="20px"/>
                    </MarketContainer.Image>

                    
               </MarketContainer.FilterLeft>
                
                <MarketContainer.FilterRight>
                    <FilterPriceDropdown value={"Price Low"} styled={[]} onDropdownChanger={onClickApply}/>                
                    <FilterDateInput styled={FilterDatePickerStyles} id={"1"} minDate={new Date(2010)} maxDate={new Date(2050)} placeholder={"Filter by sales Date"}   />    
                    <FilterApplyButton  onClickHandler={onClickApply} styled={[]} disabled={false}/>
                </MarketContainer.FilterRight>
                
          
           
            </MarketContainer.Filter>


            <MarketContainer.SwitchViewButtons>
                
                <MarketContainer.Button onClick={onClickTraditional} primary={change}>
                     Traditional Artwork
                </MarketContainer.Button>
                <MarketContainer.Button  onClick={onClickNFT} primary={nftPage}>
                     NFT Artwork
                </MarketContainer.Button>

            </MarketContainer.SwitchViewButtons>

            {
                change ?                 
                <MarketContainer.CardContainer>                
                <MarketCard cardItems={seconPagiData}></MarketCard>  
                </MarketContainer.CardContainer>                     
                :
                <MarketContainer.CardContainer>                
                <MarketCard cardItems={currentData}></MarketCard>
                </MarketContainer.CardContainer>
            }{
                change? 
                
                <Pagination
                        pageCount={Math.ceil(PageSecCount/ 12)}
                        onPageChange={handlePageClicked}
                />:
                <Pagination
                        pageCount={Math.ceil(PageCount/ 12)}
                        onPageChange={handlePageClicked}
                        />
            }
            
           
        </MarketContainer.Wrapper>
    )
}


MarketContainer.Wrapper=styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top:10px;
    padding-right: 12px;
    padding-left: 12px;

`;

MarketContainer.SwitchViewButtons=styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
`;



MarketContainer.CardContainer= styled.div`
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1140px;
    width: 100%;
    padding-right: 12px;
    padding-left: 12px;
    margin-right: auto;
    margin-left: auto;


`;

interface Props{
    primary:boolean;
}


MarketContainer.Button=styled.button <Props>`
    font-family: Poppins;
    width: 200px;
    height: 50px;
    left: 675px;
    top: 231px; 
    color:#FC6076;
    font-size: 12px;
    border-radius: 24px;
    border: none;
    margin-top: 15px;    
    :hover{
        background-color:  #F9F9F9;
    }
    background: ${props => props.primary ? "white" : "#F9F9F9"};
`;


MarketContainer.ActiveButton=styled.button`   
    font-family: Poppins;
    width: 200px;
    height: 50px;
    left: 675px;
    top: 231px; 
    color:#FC6076;
    font-size: 12px;
    border-radius: 24px;
    border: none;
    margin-top: 15px;
    
    :hover{
        background-color:  #F9F9F9;
;
    }
    :active{
        background-color:  #F9F9F9;
    }

`;

MarketContainer.Filter=styled.div`
display: flex;
align-items: center;
max-width: 1140px;
padding-right: 12px;
padding-left: 12px;
width: 100%;


`;
MarketContainer.FilterRight=styled.div`
    display: flex;
    flex: 70%;
    justify-content:end;
   
    


`
MarketContainer.FilterLeft=styled.div`
    display: flex;
    flex: 45%;
    position: relative;
    


`
MarketContainer.Image=styled.div`
        width: 50px;
        font-size: 12px;
        position: absolute;
        top: 0;
       
        right: 0px;
        z-index: 2;
        border: none;
        top: 15px;
        height: 30px;
        cursor: pointer;
        color: white;        
        transform: translateX(2px);

`;

