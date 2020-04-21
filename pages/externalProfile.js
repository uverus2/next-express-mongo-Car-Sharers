import React, {useState, useEffect,useMemo} from 'react';
import functions from "../functions";
import styled from "styled-components";
import axios from 'axios';

//Components
import Button from "../componenets/MainButton";

const MainWrap = styled.div`
    text-align: center;
    box-sizing:border-box;
    padding:5rem 15rem 0rem;

    p{
        color:${({theme}) => theme.colors.secondary};
        font-size:2.5rem;
        padding:1rem 0;
        text-align:left;
    }
    span{
        color:${({theme}) => theme.colors.dark};
        ${({theme}) => theme.font.main};
    }

    h1{
        font-size:2.5rem;
    }


    @media (max-width:1024px) {
        padding:5rem 10rem 0rem;
    }
    @media (max-width:900px) {
        padding:5rem 3rem 0rem;
    }
`;

const SubmitWrap = styled.div`
    padding:1rem 0;
    div{
        margin:auto;
    }
`;

const MainDetailsWrap = styled.div`
    display:grid;
    align-items: center;
    grid-row-gap:2rem;
    padding:0 0 3rem 0;
    grid-template-columns:350px auto;
    grid-template-areas: "image details";
    @media (max-width: 740px) {
        grid-template-areas:
        "image image"
        "details details";
    }
`;

const ImageContainer = styled.div`
    grid-area:image;
    display:flex;
    justify-content:flex-start;
    width:100%;
    max-width:300px;
    img{
        width:100%;
    }

    @media (max-width: 740px) {
       margin:auto;
    }
`;

const DetailsContainer = styled.div`
    grid-area:details;
    text-align:left;
`;


function UserProfile(props) {
    const {userID} = props;
    const [user, setUser] = useState([]);
    useEffect(()=> {
            (async() => {
                try{
                    const userData = await axios(functions.getOptionsObject(`/user/${userID}`));
                    console.log(userData);
                    setUser(userData.data);
                }catch(e){
                    console.log(e);
                }
            })();

    },[]);

    return (
        <MainWrap>
            <MainDetailsWrap>
                <ImageContainer> 
                    <img src="images/profile.jpg" alt=""/>
                </ImageContainer>
                <DetailsContainer>
                    <p className="capitalLetter"><span>Name:</span> {user.fullName}</p>
                    <p><span>Email:</span> {user.email}</p>
                    <p className="capitalLetter"><span>Gender:</span> {user.gender}</p>
                </DetailsContainer>
            </MainDetailsWrap>
                <p> <span>Interests: </span> {[user.interests].join(", ")}</p>
        </ MainWrap>
    )
}

UserProfile.getInitialProps = async(ctx) => {
    functions.auth(ctx);
    return {  userID:ctx.req.query.userID};
}

export default UserProfile

