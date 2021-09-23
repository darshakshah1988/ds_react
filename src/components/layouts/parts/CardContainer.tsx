import {Card}  from '../parts/Card';
import styled from 'styled-components';
import Pagination from '../../filters/Pagination';
import React, { useEffect, useState } from 'react';
import Arts from '../../../admin/constants/Arts';
import {TradionalArts} from '../../../admin/constants/Arts';
import FilterDateInput from '../../filters/FilterDateInput';
import FilterApplyButton from '../../filters/FilterApplyButton';
import FilterPriceDropdown from '../../filters/FilterPriceDropdown';
import FilterBasicTextField from '../../filters/FilterBasicTextField';
import { FilterDatePickerStyles } from '../../filters/filter-react-datepicker-styles';
import Image from 'next/image'



const PageCount= Arts.length;
const secPageCount=TradionalArts.length;



export const CardContainer = () => {

    const [data]=useState(Arts);        
    const [currentPage,setCurrentPage]=useState(1);    
    const [postPerPage]=useState(6);
    const indexOfLastPost=currentPage * postPerPage;
    const indexOfFirstPost=indexOfLastPost- postPerPage;
    const currentData=data.slice(indexOfFirstPost,indexOfLastPost)    

    const [dataSec]=useState(TradionalArts);      
    const [currentSecondPage,setCurrentSecondPage]=useState(1); 
    const [postPerSecPage]=useState(6);
    const indexOfLastPostSec=currentSecondPage * postPerSecPage;
    const indexOfFirstPostSec=indexOfLastPostSec- postPerPage; 
    const seconPagiData=dataSec.slice(indexOfFirstPostSec,indexOfLastPostSec);
  

    
    useEffect(() => { 
    
    },[currentData]);
    
    function handlePageClicked(number:any){
        setCurrentPage(number.selected+1)
      
    }
    
    function handelSecondPage(number:any){  
        setCurrentSecondPage(number.selected+1)
    }

    function onClickApply(){


    }
   
      
       
    return (
        <CardContainer.Wrapper>

            <CardContainer.FilterBar>
                    <CardContainer.FilterLeft>
                                        <FilterBasicTextField styled={[]} value={ ""} placeholder={"Search By Type or Name" } onChange={onClickApply}></FilterBasicTextField>
                                        <CardContainer.Image>
                                            <Image src="/SearchIcon.svg" width="20px" height="20px"/>
                                        </CardContainer.Image>

                                        
                        </CardContainer.FilterLeft>
                                    
                        <CardContainer.FilterRight>
                                        <FilterPriceDropdown value={"Price Low"} styled={[]} onDropdownChanger={onClickApply}/>                
                                        <FilterDateInput styled={FilterDatePickerStyles} id={"1"} minDate={new Date(2010)} maxDate={new Date(2050)} placeholder={"Filter by sales Date"}   />    
                                        <FilterApplyButton  onClickHandler={onClickApply} styled={[]} disabled={false}/>
                        </CardContainer.FilterRight>
                 
            </CardContainer.FilterBar>



             <CardContainer.Title>
                    NFT Artwork
            </CardContainer.Title>   
            <CardContainer.Artwork>                   
                <Card cardItems={currentData}/>              

            </CardContainer.Artwork>
            <Pagination
                pageCount={Math.ceil(PageCount/ 6)}
                onPageChange={handlePageClicked}
                />

        </CardContainer.Wrapper>
    )
}

CardContainer.Wrapper = styled.div`
    flex-direction: column;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    max-width: 1140px;
    width: 100%;
    padding-right: 12px;
    padding-left: 12px;
    margin-right: auto;
    margin-left: auto;
    
    
`;

CardContainer.Title = styled.div`
    display: flex;
    text-align: left;
    margin-top: 30px;
    margin-left: 0px;
    font-size:32px;
    width: 100%;
   
`;

CardContainer.Artwork=styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
   

`;

CardContainer.FilterRight=styled.div`
    display: flex;
    flex: 70%;
    justify-content:end;
   
    


`
CardContainer.FilterLeft=styled.div`
    display: flex;
    flex: 45%;
    position: relative;
    `;

CardContainer.Image=styled.div`
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

CardContainer.FilterBar=styled.div`
margin-top: 10px;
display: flex;
align-items: center;
max-width: 1140px;
padding-right: 12px;
padding-left: 12px;
width: 100%;

`;