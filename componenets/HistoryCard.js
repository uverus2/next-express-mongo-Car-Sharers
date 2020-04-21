import React from 'react';
import styled from "styled-components";
const moment = require('moment');

import Button from "./MainButton";

const MainWrap = styled.div`
    background:${({theme}) => theme.colors.info};
    padding:1.5rem 0;
    max-width:700px;
    border-radius:6px;
    span, h2{
        color: ${({theme}) => theme.colors.dark};
        ${({theme}) => theme.font.main}
    }

    hr{
        border-top-color: ${({theme}) => theme.colors.main};
    }

    p{
        font-size:2.7rem;
        padding:1rem 0;
        color: ${({theme}) => theme.colors.light};
    }

    img{
        max-width:500px;
        width:100%;
    }
`;

const HeaderContent = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    align-items: center;
    padding:1rem 0;
`;

const OtherContent = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
`;

const ButtonWrap = styled.div`
    margin:auto;
`;

function History(props) {
    const {user, review, driverDetails} = props;
    const returnUserDate = user.returnDate || user.returnDate !== undefined ? new Date(user.returnDate) : null;
    
    const reviewRedirect = () => {
        window.location.replace(`/review?driverDetails=${driverDetails}`);
    };

    return (
        <MainWrap>
            <HeaderContent> 
                <h2> {user.driver.user.fullName} </h2>
                <p>  Drive Completed </p>
            </HeaderContent>
                <p> <span> Distance: </span> {user.distance}miles </p>
                <img src="images/travelCompleted.png"/>
            <OtherContent> 
                <div>
                    <p> <span> From: </span> {user.locationFrom}</p>
                </div>
                <div>
                    <p> <span> To: </span> {user.locationTo}</p>
                </div>
                <div>
                    <p> <span> Date: </span> {moment.utc(user.fromDate).format("DD/MM/YYYY")}</p>
                </div>
                <div>
                    <p> <span> Time: </span> {moment.utc(user.fromDate).format("HH:mm")}</p>
                </div>

                {returnUserDate !== null && (
                    <>
                    <hr/>
                    <div>
                        <p> <span> Return from: </span> {user.locationTo} </p>
                    </div>
                    <div>
                        <p> <span> Date: </span> {moment.utc(returnUserDate).format("DD/MM/YYYY")} </p>
                    </div>
                    <div>
                        <p> <span> Time: </span> {moment.utc(returnUserDate).format("HH:mm")} </p>
                    </div>
                    </>
                )}
                {review && (<>
                 <h2>Leave A review</h2>
                 <ButtonWrap>
                   <Button onClick={reviewRedirect} text="Review Driver"/> 
                 </ButtonWrap>
                </>)}
            </OtherContent>
        </MainWrap>
    )
}


export default History
