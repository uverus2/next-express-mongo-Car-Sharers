import React from 'react';
import styled from "styled-components";
const moment = require('moment');

//Components 
import Button from "./MainButton";

const MainWrap = styled.div`
    background:${({theme}) => theme.colors.light};
    padding:1rem 0;
    max-width:700px;
    border-radius:6px;
    span, h2{
        color: ${({theme}) => theme.colors.dark};
        ${({theme}) => theme.font.main}
    }

    p{
        font-size:2.7rem;
        padding:1rem 0;
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
    padding:1rem 0;
    div{
        margin:auto;
    }
`;

function Card(props) {
    const {user, clickInfo, clickTo} = props;
    const returnUserDate = user.returnDate || user.returnDate !== undefined ? new Date(user.returnDate) : null;

    const clickAction = () => {
        window.location.replace(`/${clickTo}?slug=${clickInfo}`);
    };


    return (
        <MainWrap>
            <HeaderContent> 
                <h2> {user.driver.user.fullName} </h2>
                <p> <span> Price: </span> £{user.price} </p>
            </HeaderContent>
            <p> <span> Distance: </span> {user.distance}miles </p>
            <img src="images/drive.png"/>
            <OtherContent> 
                <div>
                    <p> <span> From: </span> {user.locationFrom}  </p>
                </div>
                <div>
                    <p> <span> To: </span> {user.locationTo} </p>
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
            </OtherContent>
            <ButtonWrap> 
                <Button onClick={clickAction} text="View Drive"/>
            </ButtonWrap>
        </MainWrap>
    )
}

Card.defaultProps = {
    clickTo:"drive-view"
}



export default Card
