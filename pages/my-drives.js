import React, { useState, useEffect } from 'react';
import functions from "../functions";
import styled from "styled-components";
import axios from "axios";
import Head from 'next/head';


// Components
import Card from "../componenets/Card";
import HistoryCard from "../componenets/HistoryCard";

const moment = require('moment');

const MainWrap = styled.div`
    text-align:center;
    padding-top:2rem;
`;

const Cards = styled.div`
    display:grid;
    grid-template-columns: repeat( auto-fit, minmax(250px, 700px));
    grid-gap:1rem;
    justify-content: center;
`;

const CardsWrap = styled.div`
    padding:2rem 0;
    text-align:center;
`;


function MyDrives(props) {
    const { user } = props;
    const [userDrives, setUserDrives] = useState([]);

    useEffect(() => {
        (async() => {
            try {
                const tripsData = await axios(functions.getOptionsObject(`/drives/all`));
                console.log(tripsData);
                const filterDrives = tripsData.data.filter(i => i.driver.user._id === user._id);
                setUserDrives(filterDrives);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

   
    
    const historyDrives = userDrives.filter(i => moment.utc(i.fromDate).isBefore());
    const upcomingDrives = userDrives.filter(i => moment.utc(i.fromDate).isSame() || moment.utc(i.fromDate).isAfter());
    const history = historyDrives.map(i => {
        return <HistoryCard user={i} clickInfo={i.slug} key={i.slug}/>
    });

    const upcoming = upcomingDrives.map(i => {
        return <Card clickTo="driver-page" user={i} clickInfo={i.slug} key={i.slug}/>
    });

    return ( 
        <MainWrap>
            <Head>
                <title>Car Sharers - My Drives</title>
            </Head>
            <h1>My Drives</h1>
            {userDrives.length <= 0 && (<h2>No Drives currently</h2>)}
            <CardsWrap>
                {upcoming.length > 0 && (<h2>Upcoming Trips</h2>)}
                <Cards> 
                    {upcoming} 
                </Cards>
            </CardsWrap>
            <CardsWrap>
                {history.length > 0 && (<h2>History</h2>)}
                <Cards> 
                    {history} 
                </Cards>
            </CardsWrap>
        </MainWrap>
    )
}

MyDrives.getInitialProps = async(ctx) => {
    functions.auth(ctx);
    return { user: ctx.req.session.passport.user };
}

export default MyDrives