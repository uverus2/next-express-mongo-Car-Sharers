import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import axios from "axios";
import functions from "../functions";
import Head from 'next/head';
// Components
import Button from "../componenets/MainButton";
import SecondaryButton from "../componenets/SecondaryButton";
import SosButton from "../componenets/SosButton";
import SearchFrom from "../componenets/Forms/SearchForm";
import Card from "../componenets/Card";

const moment = require('moment');


const MainWrap = styled.div`
    text-align:center;
`;

const HeroSection = styled.div`
    margin-top:-2.7%;
    background:url("images/hero.jpg");
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
`;

const InnerHero = styled.div`
    height:100%;
    padding:5% 15rem 3rem;

    h1{
        margin-top:1rem;
    }
    @media (max-width:1024px) {
        padding:5% 10rem 3rem;
    }
    @media (max-width:900px) {
        padding:5% 3rem 3rem;
    }
    @media (max-width:480px) {
        padding-top:4rem;
        padding-bottom:3rem;
    }
`;

const ButtonWrap = styled.div`

    div{
        margin:0;
        padding:1rem 0;
        box-sizing: border-box;
    }

    a{
        width:auto;
    }

    a:nth-child(1) button{
        background:${({theme}) => theme.colors.dark};
    }

    a:nth-child(1) button:hover{
        background:transparent;
    }

    @media (max-width:480px) {
        padding-bottom:4rem;
       div{
           margin:auto;
        }
    }
`;

const Title = styled.div`
    padding:2rem 0;
`;

const Cards = styled.div`
    display:grid;
    grid-template-columns: repeat( auto-fill, minmax(250px, 700px));
    grid-gap:1rem;
    justify-content: center;
`;

function index(props) {
    const {user} = props;
    const [latestDrives, setLatestDrives] = useState([]);
    const [checkDriver, setCheckDriver] = useState(true);
    useEffect(() => {
        (async () => {
            try{
                const doesDriverExist = await axios(functions.getOptionsObject(`/driver/exists/${user._id}`));
                const driverData = await axios(functions.getOptionsObject(`/drives/all`));
                const historyDrives = driverData.data.filter(i => moment.utc(i.fromDate).isSame() || moment.utc(i.fromDate).isAfter());
                const filteredArray = historyDrives.filter(i => i.driver.user._id !== user._id);
                filteredArray.length = 6;
                setLatestDrives(filteredArray);
                setCheckDriver(doesDriverExist.data);
            }catch(e){
                console.log(e);
            }
        })();
    }, []);

    const onSubmitFrom = data => {
        const date = new Date(data.driveDate);
        const driveDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
        window.location.replace(`/search?location=${data.fromAddress}&to=${data.toAddress}&date=${driveDate}&time=${data.driveTime}`);
    };

    const cards = latestDrives.map(i => {
        return <Card user={i} clickInfo={i.slug} key={i.slug}/>
    });

    return (
        <MainWrap>
            <Head>
                <title>Car Sharers - Home </title>
            </Head>
            <HeroSection>
                <InnerHero>
                    <h1>Looking for a ride?</h1>
                    <SearchFrom onSubmit={onSubmitFrom}/>
                    {!checkDriver && (
                    <ButtonWrap>
                        <a href="/add-trip"> <SecondaryButton text="Offer a Ride"/> </a>
                    </ButtonWrap>
                    )}
                </InnerHero>
            </HeroSection>
            <SosButton/>
            <Title> 
                 <h1>Latests Drive Offers</h1>
            </Title>
            <Cards>
                {cards}
            </Cards>
        </MainWrap>
    )
}

index.getInitialProps = async(ctx) => {
    functions.auth(ctx);
    return { user: ctx.req.session.passport.user};
}

export default index

