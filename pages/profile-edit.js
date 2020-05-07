import React, { useState } from 'react';
import styled from "styled-components";
import axios from "axios";
import functions from "../functions";
import Head from 'next/head';

// Components 
import Form from "../componenets/Forms/updateUserForm";

const MainWrap = styled.div`
    text-align: center;
    width:100%;
    padding:5rem 0;
`;

const ErrorText = styled.h4`
    color:red;
`;

function ProfileEdit(props) {
    const {user} = props;
    const dataSubmit = async data => {
        console.log(data);
        try {
            // Update User
            const userData = {
                id: user._id,
                email: data.email,
                fullName: data.fullName.toLowerCase(),
                interests: data.interests.split(","),
                gender: data.gender
            };


            const updateUserOptions = functions.putOptionsObject(userData,"/user/update");
            await axios(updateUserOptions);
            await axios(functions.postOptionsObject(userData,"/auth/edit-session"));

            const doesDriverExist = await axios(functions.getOptionsObject(`/driver/exists/${user._id}`));
            if (data.toggle === "true") {
                let carData = {
                    email: data.email,
                    numberPlate: data.numberPlate.toLowerCase(),
                    brand: data.brand.toLowerCase(),
                    model: data.model.toLowerCase(),
                    year: data.year,
                    fuelType: data.fuel.toLowerCase()
                };

                let driver = {
                    email: data.email.toLowerCase(),
                    phone: data.phone,
                    postcode: data.postCode,
                    address: data.address.toLowerCase()
                };

                if(doesDriverExist.data) {
                    //Insert
                    await axios(functions.postOptionsObject(driver, "/driver/insert"));
                    await axios(functions.postOptionsObject(carData, "/api/car/insert"));
                    window.location.replace("/user-profile");
                }else{
                    //Update
                    await axios(functions.putOptionsObject(driver, "/driver/update"));
                    await axios(functions.putOptionsObject(carData,"/api/car/update"));
                    window.location.replace("/user-profile");
                }
            }

            window.location.replace("/user-profile");
        } catch (e) {
            console.log(e);
        }

    };

    return ( 
        <MainWrap>
            <Head>
                <title>Car Sharers - Profile</title>
            </Head>
            <h1> Update User Account </h1>
            <Form user={user} onSubmit = { dataSubmit }/> 
        </MainWrap>
        )
    }

    ProfileEdit.getInitialProps = async(ctx) => {
        functions.auth(ctx);
        console.log(ctx.req.session.passport.user);
        return { user: ctx.req.session.passport.user};
    }


    export default ProfileEdit