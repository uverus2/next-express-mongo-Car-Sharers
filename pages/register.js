import React, { useState } from 'react';
import styled from "styled-components";
import axios from "axios";
import functions from "../functions";

// Components 
import Logo from "../componenets/MainLayout/CenteredLogo";
import Form from "../componenets/Forms/registerForm";

const MainWrap = styled.div`
    text-align: center;
    width:100%;
    height:100vh;
`;

const ErrorText = styled.h4 `
    color:red;
`;

function index(props) {
    const [emailCheck, setEmailCheck] = useState(false);
    const dataSubmit = async data => {
        console.log(data);
        try {
            // Register User
            const user = {
                email: data.email,
                password: data.password,
                fullName: data.fullName.toLowerCase(),
                interests: data.interests.split(","),
                gender: data.gender
            };

            const isEmailValid = await axios(functions.getOptionsObject(`/user/emailCheck/${user.email}`));

            if (isEmailValid.data) {
                setEmailCheck(true);
            } else {
                setEmailCheck(false);
                await axios(functions.postOptionsObject(user, "/user/insert"));

                if (data.toggle === "true") {
                    const driver = {
                        email: data.email.toLowerCase(),
                        phone: data.phone,
                        postcode: data.postCode,
                        address: data.address.toLowerCase()
                    };

                    const car = {
                        email: data.email,
                        numberPlate: data.numberPlate.toLowerCase(),
                        brand: data.brand.toLowerCase(),
                        model: data.model.toLowerCase(),
                        year: data.year,
                        fuelType: data.fuel.toLowerCase()
                    };
                    await axios(functions.postOptionsObject(driver, "/driver/insert"));
                    await axios(functions.postOptionsObject(car, "/api/car/insert"));
                }
                window.location.replace("/login");
            }
        } catch (e) {
            console.log(e);
        }

    };

    return ( 
        <MainWrap>
            <Logo/>
            <h1> Create an Account </h1>
            {emailCheck && < ErrorText > Email is already taken </ErrorText>} 
            <Form onSubmit = { dataSubmit }/> 
        </MainWrap>
        )
    }


    export default index