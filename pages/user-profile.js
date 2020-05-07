import React, {useState, useEffect,useMemo} from 'react';
import functions from "../functions";
import styled from "styled-components";
import axios from 'axios';
import Head from 'next/head';

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

const DriverDetails = styled.div`
    padding:1.5rem 0;
`;

const CarDetails = styled.div`
    padding:1.5rem 0;
`;

function UserProfile(props) {
    const {user} = props;
    const [driver, setDriver] = useState("Empty");
    const [car, setCar] = useState("Empty");
    console.log(user);

    useEffect(()=> {
            (async() => {
                try{
                    const options = functions.getOptionsObject(`/driver/${user._id}`);
                    const driverData = await axios(options);
                    const carOptions = functions.getOptionsObject(`api/cars/driver/${driverData.data._id}`);
                    const carData = await axios(carOptions);

                    setDriver(driverData.data);
                    setCar(carData.data);

                }catch(e){
                    console.log(e);
                    setDriver("Empty");
                    setCar("Empty");
                }
            })();

    },[]);

    return (
        <MainWrap>
            <Head>
                <title>Car Sharers - Profile</title>
            </Head>
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
                <p> <span>Interests: </span> {user.interests.join(", ")}</p>
                <CarDetails> 
                    <h1> Car Details </h1>
                    {car === "Empty" ? (<h4>No Car information please update profile to change it</h4>) : (
                        <>
                            <p className="capitalLetter"><span>Number Plate:</span> {car.numberPlate} </p>
                            <p className="capitalLetter"><span>Brand:</span> {car.brand} </p>
                            <p className="capitalLetter"><span>Model:</span> {car.model} </p>
                            <p><span>Year:</span> {car.year} </p>
                            <p className="capitalLetter"><span>Fuel Type:</span> {car.fuelType} </p>
                        </>
                    )}
                </CarDetails>
                <DriverDetails>
                    <h1> Driver Details </h1>
                    {driver === "Empty" ? (<h4>No Driver information please update profile to change it</h4>) : (
                        <>
                            <p className="capitalLetter"><span>Address: </span> {driver.address} </p>
                            <p className="uppercaseLetter"><span>Post Code:</span> {driver.postcode} </p>
                            <p className="capitalLetter"><span>Phone:</span> {driver.phone} </p>
                        </>
                    )}
                </DriverDetails>
            <SubmitWrap> 
                <a href="profile-edit">
                    <Button text="Edit Profile"/>
                </a>
            </SubmitWrap>
        </ MainWrap>
    )
}

UserProfile.getInitialProps = async(ctx) => {
    functions.auth(ctx);
    return { user: ctx.req.session.passport.user};
}

export default UserProfile

