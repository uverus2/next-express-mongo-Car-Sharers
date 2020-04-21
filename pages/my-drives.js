import React, { useState, useEffect } from 'react';
import functions from "../functions";
import styled from "styled-components";
import axios from "axios";


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
                const tripsData = await axios(functions.getOptionsObject(`/trips/all`));
                const filterDrives = tripsData.data.filter(i => i.drive.driver.user._id === user._id);
                setUserDrives(filterDrives);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

   
    
    const historyDrives = userDrives.filter(i => moment.utc(i.drive.fromDate).isBefore());
    const upcomingDrives = userDrives.filter(i => moment.utc(i.drive.fromDate).isSame() || moment.utc(i.drive.fromDate).isAfter());
    const history = historyDrives.map(i => {
        return <HistoryCard user={i.drive} clickInfo={i.drive.slug} key={i.slug}/>
    });

    const upcoming = upcomingDrives.map(i => {
        return <Card clickTo="driver-page" user={i.drive} clickInfo={i.drive.slug} key={i.slug}/>
    });

    return ( 
        <MainWrap>
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