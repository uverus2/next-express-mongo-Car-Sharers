import React, {useState} from 'react';
import styled from "styled-components";
import axios from "axios";
import functions from "../functions";

//Components 
import Button from "./MainButton";
import SecondaryButton from "./SecondaryButton";

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
    flex-direction:column;
    justify-content:flex-start;
    align-items: center;
    padding:1rem 2rem;
`;

const ButtonWrapStatus = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items: center;
    padding:1rem 1rem;
    
    div{
        padding:0rem 1rem;
    }

    @media (max-width: 740px) {
        flex-direction:column;
        div{
            padding:1rem 0rem;
        }
    }
`;


const ButtonWrap = styled.div`
    padding:1rem 0;
    div{
        margin:auto;
    }
`;

function StatusCard(props) {
    const {user, clickInfo, acceptClickData, awaiting} = props;
    const [accepted, setAccepted] = useState(false);
    const [rejected, setRejected] = useState(false);
    const clickAction = () => {
        window.location.replace(`/externalProfile?userID=${clickInfo}`);
    };

    const acceptClick = async() => {
        try{
            const trips = {
                status:"accepted",
                tripID:  acceptClickData
            };
            await axios (functions.putOptionsObject(trips,"/trips/status/update/tripID"));
            setAccepted(true)

        }catch(e) {
            console.log(e);
        }
    };

    const rejectClick = async() => {
        try{
            const trips = {
                status:"rejected",
                tripID:  acceptClickData
            };
            await axios (functions.putOptionsObject(trips,"/trips/status/update/tripID"));
            setRejected(true)

        }catch(e) {
            console.log(e);
        }
    };


    return (
        <MainWrap>
            <HeaderContent> 
                <p> <span> Name </span> {user.fullName} </p>
                <p> <span> Email </span>{user.email} </p>
            </HeaderContent>
            {accepted && (<h2> User has been accepted</h2>)}
            {rejected && (<h2> User has been rejected</h2>)}
            {awaiting && !accepted && !rejected && (
                <ButtonWrapStatus>
                    <Button onClick={acceptClick} text="Accept"/>
                    <SecondaryButton onClick={rejectClick} className="second" text="Reject"/> 
                </ButtonWrapStatus>
            )}
            <ButtonWrap> 
                <Button onClick={clickAction} text="View profile"/>
            </ButtonWrap>
        </MainWrap>
    )
}

StatusCard.defaultProps = {
    clickInfo:"",
    awaiting:false,
}

export default StatusCard
