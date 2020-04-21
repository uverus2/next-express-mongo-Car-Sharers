import React from 'react';
import styled from "styled-components";
import axios from "axios";
import functions from "../functions";

// Components 
import Logo from "../componenets/MainLayout/CenteredLogo";
import Form from "../componenets/Forms/loginForm";

const MainWrap = styled.div `
    text-align: center;
    width:100%;
    height:100vh;
    display: flex;
    flex-direction: column;
    justify-content:center;
`;

function index(props) {

    const dataSubmit = async data => {
        console.log(data);
        try {
            const user = {
                email: data.email,
                password: data.password
            };
            const userLogin = functions.postOptionsObject(user, "auth/login");
            await axios(userLogin);
            window.location.replace("/");
        } catch (e) {
            console.log(e);
        }
    };

    return ( 
        <MainWrap>
            <Logo/>
            <h1> Log In Please </h1> 
            <Form onSubmit={dataSubmit}/> 
            <p> Don’ t have an accout ? <a href = "/register" > Sign up </a></p>
        </MainWrap>
    )
}


export default index