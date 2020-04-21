import React, {useState, useEffect} from 'react';
import functions from "../functions";
import styled from "styled-components";
import axios from "axios";

// Components
import Card from "../componenets/Card";
import HistoryCard from "../componenets/HistoryCard";


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

const MainWrap = styled.div`
    text-align:center;
    padding:2rem 0;
`;


function MyTrips(props) {
    const {user} = props;

    const [rejectedTrips, setRejectedTrips] = useState([]);
    const [awaitingTrips, setAwaitingTrips] = useState([]);
    const [acceptedTrips, setAcceptedTrips] = useState([]);
    const [expiredTrips, setExpiredTrips] = useState([]);
    const [payedTrips, setPayedTrips] = useState([]);

    const [tripsCheck, setTripsCheck] = useState(false);
    
    useEffect(() => {
        (async () => {
            try{
                const tripsData = await axios(functions.getOptionsObject(`/trips/user/${user._id}`));
                console.log(tripsData);
                if(tripsData.data.length <= 0){
                    setTripsCheck(true);
                }

                const assignFunction = (status, stateToUpdate) => {
                    const tester = tripsData.data.filter(i => i.status === status);
                    stateToUpdate(tester);
                };

                tripsData.data.map(i => {
                    if(i.status !== "none"){
                        const iCapital = i.status.charAt(0).toUpperCase() + i.status.slice(1)
                        assignFunction(i.status,eval(`set${iCapital}Trips`));
                    }
                });
            }catch(e){
                console.log(e);
            }
        })();
    }, []);

    

    const cardAssign = (array,arrayToAdd) => {
        array.map(i => {
            arrayToAdd.push(<Card user={i.drive} clickInfo={i.drive.slug} key={i._id}/>);
        });
    }

    let userStatuses = {
        expired:[]
    }

    cardAssign(rejectedTrips, userStatuses.rejected = []);
    cardAssign(awaitingTrips, userStatuses.awaiting = []);
    cardAssign(acceptedTrips, userStatuses.accepted = []);
    cardAssign(payedTrips, userStatuses.payed = []);

    expiredTrips.map(i => {
        userStatuses.expired.push(<HistoryCard key={i._id} driverDetails={i.drive.driver._id} review={true} user={i.drive}/>);
     });
    

    return (
        <MainWrap>
            <h1>My Trips</h1>
            {tripsCheck && (<h2>No Current Trips</h2>)}
            {userStatuses.payed.length > 0 && ( 
                <CardsWrap>
                    <h2>Upcoming Trips</h2>
                    <Cards> 
                        {userStatuses.payed}
                    </Cards>
                </CardsWrap>
            )}
            {userStatuses.accepted.length > 0 && ( 
            <CardsWrap>
                <h2>Trips Requiring Payment</h2>
                <Cards> 
                    {userStatuses.accepted}
                </Cards>
            </CardsWrap>
            )}
            {userStatuses.awaiting.length > 0 && ( 
            <CardsWrap>
                <h2>Trips Awaiting for driver approval</h2>
                <Cards> 
                    {userStatuses.awaiting}
                </Cards>
            </CardsWrap>
            )}
            {userStatuses.rejected.length > 0 && ( 
            <CardsWrap>
                <h2>Trips you have been rejected from</h2>
                <Cards> 
                    {userStatuses.rejected}
                </Cards>
            </CardsWrap>
            )}
            {userStatuses.expired.length > 0 && ( 
            <CardsWrap>
                <h2>Completed Trips</h2>
                <Cards> 
                    {userStatuses.expired}
                </Cards>
            </CardsWrap>
            )}
        </MainWrap>
    )
}

MyTrips.getInitialProps = async(ctx) => {
    functions.auth(ctx);
    return { user: ctx.req.session.passport.user};
}

export default MyTrips

