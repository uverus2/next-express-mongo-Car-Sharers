import React, { useState } from 'react';
import styled from "styled-components";
import axios from "axios";
import functions from "../functions";

// Components 
import Form from "../componenets/Forms/newTripForm";

const MainWrap = styled.div`
    text-align: center;
    width:100%;
    padding:5rem 0;
`;

const ErrorText = styled.h4`
    color:red;
`;

function TripsAdd(props) {
    const {user} = props;
    const dataSubmit = async (data, fromDataApi, toDataApi) => {
        console.log(data);
        try {
            const fromData = fromDataApi.results[0].geometry.location,
                toData = toDataApi.results[0].geometry.location,
                travelDetails = await axios(functions.getOptionsObject(`https://api.tomtom.com/routing/1/calculateRoute/${fromData.lat},${fromData.lng}:${toData.lat},${toData.lng}/json?key=qGdIpAKigXZEv2P7IzXL0CENAYAoADsX`)),
                carDetails = await axios(functions.getOptionsObject(`api/cars/driver/email/${user.email}`)),
                fuelDetails = await axios(functions.getOptionsObject(`api/fuel/${carDetails.data.fuelType}`)),
                milesToTravel = travelDetails.data.routes[0].summary.lengthInMeters/1609,
                fuelPrice = fuelDetails.data.price,
                carMPG = carDetails.data.fuelConsumption,
                mpgCarCost = carMPG/4.54609188,
                result = ((milesToTravel*fuelPrice)/mpgCarCost)/100 * 1.2;

                // Insert User
                let driveData = {
                    email: user.email,
                    locationFrom:`${data.fromAddress} ${data.fromTown}`,
                    locationTo: `${data.toAddress} ${data.toTown}`,
                    fromDate:data.driveDate,
                    fromCoordinates: [fromData.lat, fromData.lng],
                    toCoordinates: [toData.lat, toData.lng],
                    distance: milesToTravel.toFixed(2),
                    price: result.toFixed(2)
                };

            if(data.toggle === "true"){
                driveData.returnDate = data.driveDateReturn;
            }
            console.log(driveData);
            await axios(functions.postOptionsObject(driveData,"/drive/insert"));
            window.location.replace("/");
        } catch (e) {
            console.log(e);
        }

    };

    return ( 
        <MainWrap>
            <h1> Create a drive </h1>
            <Form onSubmit = {dataSubmit}/> 
        </MainWrap>
        )
    }

    TripsAdd.getInitialProps = async(ctx) => {
        functions.auth(ctx);
        console.log(ctx.req.session.passport.user);
        return { user: ctx.req.session.passport.user};
    }


    export default TripsAdd