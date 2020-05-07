import React, {useState, useEffect} from 'react';
import functions from "../functions";
import styled from "styled-components";
import axios from "axios";
import dynamic from 'next/dynamic';
const moment = require('moment');
import Head from 'next/head';


//Components 
import Button from "../componenets/SecondaryButton";
import StatusCard from "../componenets/StatusCard";

const Map = dynamic(
    () => import('../componenets/Map'),
  { ssr: false }
);

const MainWrap = styled.div`
    text-align:center;

    p{
        color:${({theme}) => theme.colors.secondary};
        font-size:2.5rem;
        padding:1rem 0;
        text-align:left;

        span{
            text-transform: capitalize;
        }
    }
    span{
        color:${({theme}) => theme.colors.dark};
        ${({theme}) => theme.font.main};
    }
`;

const ContentSection = styled.div`
    height:100%;
    padding:2rem 15rem 2rem;

    @media (max-width:1024px) {
        padding:2rem 10rem 2rem;
    }
    @media (max-width:900px) {
        padding:2rem 3rem 2rem;
        padding-bottom:0;
    }
    @media (max-width:480px) {
        padding-left:0;
        padding-right:0;
        padding-bottom:0;
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

const Devider = styled.div`
    img{
        width:100%;
    }
    @media (max-width: 740px) {
        padding:0;
        img{
            min-height:5rem;
        }
    }
`;

const ReviewsWrap = styled.div`
    padding:2rem 0;
    h1{
        text-align:left;
    }
`;

const JourneyDetails = styled.div`
    display:grid;
    padding:2rem 0;
    grid-template-columns:1fr 1fr 1fr;
    justify-content:start;
    grid-gap:1rem;

    @media (max-width: 740px) {
        grid-template-columns:1fr;
        grid-gap:0;
    };
`;

const ReviewCard = styled.div`
    background:${({theme}) => theme.colors.secondary};
    color:${({theme}) => theme.colors.light};
    margin-left: 1.5rem;
    margin-top:1.5rem;
    max-width: 100%;
    text-align: left;
    padding: 2rem;
    border-radius: 2.5rem;

    p{
        color:${({theme}) => theme.colors.light};
        font-size:2rem;
        padding:1.5rem 0;
    }

    h2{
        text-align:center;
        font-size:2.2rem;
    }

    h3{
        font-weight: bolder;
        font-size:2.5rem;
    }

    @media (max-width: 740px) {
        margin-left:0;
        padding: 1rem;
    }
`;

const FigureComponent = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding:1rem 0;

    div{
        margin:1rem auto;
    }

    @media (max-width: 740px) {
        div{
            margin:0.5rem auto;
        }
    }


`;

function driveView(props) {
    const {user, slug} = props;

    // Drives Needed States
    const [driverData, setDriverData] = useState([]);
    const [carData, setCarData] = useState([]);
    const [journeyData, setJourneyData] = useState([]);
    const [userData, setUserData] = useState([]);

    // Map Needed States
    const [coordinates, setCoordinates] = useState([]);
    const [coordinatesTo, setCoordinatesTo] = useState([]);

    // Review Needed State
    const [reviewData, setReviewData] = useState([]);

    // User Status needed state
    let [userStatus, setUserStatus] = useState([]);
    let [awaitingStatus, setAwaitingStatus] = useState(false);
    let [paymentStatus, setPaymentStatus] = useState(false);

    useEffect(() => {
        (async () => {
            try{
                // General Drives Data
                const driverDBData = await axios(functions.getOptionsObject(`/drives/driver/${slug}`));

                let array = [];
                await Promise.all(
                    driverDBData.data.users.map(async i => {
                        try{
                            const getTripData = await axios(functions.getOptionsObject(`trips/oneTrip/${i._id}&${driverDBData.data._id}`));
                            if(getTripData.data.length > 0){
                                array.push(getTripData.data);
                            }
                        }catch(e){
                            console.log(e)
                        }
                     }));

                setUserStatus(array);
                

                const carDBData = await axios(functions.getOptionsObject(`api/cars/driver/${driverDBData.data.driver._id}`));
                const reviewDBData = await axios(functions.getOptionsObject(`/reviews/driver/${driverDBData.data.driver.user.email}`));
    
                setReviewData(reviewDBData.data)
                setDriverData(driverDBData.data.driver);
                setUserData(driverDBData.data.driver.user);
                setJourneyData(driverDBData.data);
                setCarData(carDBData.data);

                // For Map
                setCoordinates(driverDBData.data.fromCoordinates);
                setCoordinatesTo(driverDBData.data.toCoordinates);
            }catch(e){
                console.log(e);
            }
        })();
    }, []);
    
    // Review grab
    let reviewCards = "";
    if (reviewData.length > 0){
        reviewCards = reviewData.map(i => {
            return (
                <ReviewCard key={i._id}>
                    <h3 className="capitalLetter">{i.user.fullName}</h3>
                    <p>{i.review}</p>
                </ReviewCard>
            );
        });
    };

 
   console.log(userStatus);

    const filterUsers = userStatus.filter(i => i.status !== "rejected");
    

    let usersStatuses = {
        awaiting:[],
        accepted:[],
        payed:[]
    };

    if(filterUsers.length > 0){
        filterUsers.map(i => {
            if(i[0].status === "awaiting"){
                const status = <StatusCard acceptClickData={i[0]._id} clickInfo={i[0].user._id} key={i[0]._id} awaiting={true} user={i[0].user}/>;
                usersStatuses.awaiting.push(status);
            }else if (i[0].status === "accepted"){
                const status = <StatusCard key={i[0]._id} clickInfo={i[0].user._id} user={i[0].user}/>;
                usersStatuses.accepted.push(status);
            }else if (i[0].status === "payed"){
                const status = <StatusCard key={i[0]._id} clickInfo={i[0].user._id} user={i[0].user}/>;
                usersStatuses.payed.push(status);
            }
        });
    }
 
    console.log(usersStatuses)

    return (
        <MainWrap>
            <Head>
                <title>Car Sharers - Driver</title>
            </Head>
            <ContentSection>
                <h1>Driver Details</h1>
                <MainDetailsWrap>
                    <ImageContainer>
                        <img src="images/carDrive.png" alt=""/>
                    </ImageContainer>
                    <DetailsContainer>
                        <p className="capitalLetter"><span>Driver: </span>{userData.fullName}</p>
                        <p className="capitalLetter"><span>Gender: </span>{userData.gender}</p>
                        <p className="capitalLetter"><span>Car: </span>{`${carData.brand} ${carData.model}`}</p>
                        <p><span>Number: </span>{driverData.phone}</p>
                    </DetailsContainer>
                </MainDetailsWrap>
            </ContentSection>
            <Devider>
                <img src="images/LP-top-devider.png" alt=""/>
            </Devider>
            <ContentSection>
                <h1>Journey Details</h1>
                <JourneyDetails>
                    <div>
                        <p><span>From: </span>{journeyData.locationFrom}</p>
                        <p><span>Time: </span> {moment.utc(journeyData.fromDate).format("HH:mm")} </p>
                        <p><span>Cost: </span>{journeyData.price}</p>
                    </div>
                    <div>
                        <p><span>To: </span>{journeyData.locationTo}</p>
                        {journeyData.returnDate && (<p><span>Return Date: </span>{moment.utc(journeyData.returnDate).format("DD/MM/YYYY")}</p>)}
                    </div>
                    <div>
                        <p><span>Date: </span>{moment.utc(journeyData.fromDate).format("DD/MM/YYYY")}</p>
                        {journeyData.returnDate && (<p><span>Return Time: </span>{moment.utc(journeyData.returnDate).format("HH:mm")}</p>)}
                    </div>
                </JourneyDetails>
                {usersStatuses.payed.length > 0 && (<>
                         <h2>Users travelling with you</h2>
                    <FigureComponent>
                        {usersStatuses.payed}
                    </FigureComponent>
                </>)}
                {usersStatuses.accepted.length > 0 && (<>
                         <h2>Users to pay</h2>
                    <FigureComponent>
                        {usersStatuses.accepted}
                    </FigureComponent>
                </>)}
            </ContentSection>
            <Devider>
                <img src="images/LP-bottom-devider.png" alt=""/>
            </Devider>
                <ContentSection>
                    <Map locationFrom={coordinates} locationTo={coordinatesTo}/>
                </ContentSection>
            <Devider>
                <img src="images/LP-bottom-devider.png" alt=""/>
            </Devider>
            <ContentSection>
                <h1>Car Details</h1>
                    <DetailsContainer>
                        <p className="capitalLetter"><span>Brand: </span>{carData.brand}</p>
                        <p className="capitalLetter"><span>Model: </span>{carData.model}</p>
                        <p className="uppercaseLetter"><span>Number Plate: </span>{carData.numberPlate}</p>
                    </DetailsContainer>
                    {usersStatuses.awaiting.length > 0 && (<>
                    <h2>Awaiting your decision</h2>
                    <FigureComponent>
                        {usersStatuses.awaiting}
                    </FigureComponent>
                    </>)}
                <ReviewsWrap>
                    <h1>Driver Reviews</h1> 
                    {reviewCards === "" && <h2> No Reviews Yet </h2> }
                    {reviewCards}
                </ReviewsWrap>
            </ContentSection>
        </MainWrap>
    )
};

driveView.getInitialProps = async(ctx) => {
    functions.auth(ctx);
    return { user: ctx.req.session.passport.user, slug:ctx.req.query.slug};
}

export default driveView

