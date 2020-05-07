import React, {useState} from 'react';
import styled from "styled-components";
import axios from "axios";
import functions from "../functions";
import Head from 'next/head';

// Components 
import Logo from "../componenets/MainLayout/CenteredLogo";
import Form from "../componenets/Forms/additionalForm";

const MainWrap = styled.div`
    text-align: center;
    width:100%;
    height:100vh;
`;

const ErrorText = styled.h4`
    color:red;
`;

function Additional(props) {
    const {user} = props;
    const [emailCheck,setEmailCheck] = useState(false);
    const dataSubmit = async data => {
        
        try{
            // Register User
            const userData = {
                    email:user.email,
                    interests:data.interests.split(","),
                    gender:data.gender
            };

            console.log(userData);
                await axios(functions.putOptionsObject(userData,"/user/google-update"));

                if(data.toggle === "true") {
                  const driver = {
                      email: user.email,
                      phone: data.phone,
                      postcode:data.postCode,
                      address:data.address.toLowerCase()
                  };

                  const car = {
                    email: user.email,
                    numberPlate:data.numberPlate.toLowerCase(),
                    brand: data.brand.toLowerCase(),
                    model:data.model.toLowerCase(),
                    year:data.year,
                    fuelType:data.fuel.toLowerCase()
                  };
                  await axios(functions.postOptionsObject(driver,"/driver/insert"));
                  await axios(functions.postOptionsObject(car,"/api/car/insert"));
              }

              await axios(functions.postOptionsObject(userData,"/auth/update-session"));
              window.location.replace("/");


        }catch(e){
            console.log(e);
        }
    };

    return (
        <MainWrap>
            <Head>
                <title>Car Sharers - Additional</title>
            </Head>
            <Logo/>
            <h1>Tell us a bit more to continue</h1>
            <Form onSubmit={dataSubmit} />
        </MainWrap>
    )
}

Additional.getInitialProps = async(ctx) => {
    if (typeof ctx.req.session.passport === "undefined" || !ctx.req.session.passport.user) {
        ctx.res.redirect("/login");
    }
    return { user: ctx.req.session.passport.user};
}


export default Additional

