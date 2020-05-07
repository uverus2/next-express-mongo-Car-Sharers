import React, {useState} from 'react';
import functions from "../functions";
import Head from 'next/head';

//Components
import Button from "../componenets/MainButton";


import { useForm } from 'react-hook-form';
import { string, object } from 'yup';
import styled from "styled-components";
import axios from 'axios';


let schema = object().shape({
    review: string().required("Field is required").max(145,"Max 145 characters"),
});

const MainWrap = styled.div`
    text-align: center;
    width:100%;
    padding:3rem 0;
`;

const SubmitWrap = styled.div`
    max-width: 600px;
    padding:1rem 0;
    margin: auto;

    div{
        margin:auto;
    }
`;

const InputWrap = styled.div`
    max-width:600px;
    padding:1rem 0;
    margin:auto;
    display:flex;
    justify-content:center;
    flex-direction:column;
    input,label{
        width:100%;
    }

    p{
        text-align:left;
    }
`;


function Review(props) {
    const {user,driverID} = props;
    let [characters, limitCharacters] = useState(145);
    const { register, handleSubmit, reset, errors } = useForm({validationSchema:schema});

    const charactersCount = (e) => {
        if(characters <= 145) {
            limitCharacters(characters = characters - 1);
        }
        if(characters <= 0) {
            limitCharacters(characters = 0);
        }
    };

    const onSubmit = async data => {
        console.log(data);
        try{
            const userReview = {
                driverID:driverID,
                review:data.review,
                userEmail: user.email
            };
            console.log(userReview)
            const options = functions.postOptionsObject(userReview,"/reviews/insert");

            await axios(options);
            window.location.replace(`/my-trips`);

        }catch(e){
            console.log(e);
        }
    };

    return (
        <MainWrap>
            <Head>
                <title>Car Sharers - Review</title>
            </Head>
            <h1> Leave a Review </h1> 
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputWrap>
                    {errors.review && (<ErrorMessage> {errors.review.message} </ErrorMessage>)}
                    <label htmlFor="review">How was your drive</label>
                    <textarea type="text"  name="review" ref={register} maxLength="145" onKeyPress={charactersCount} rows="4" cols="40"/>
                    <p>{characters} chars</p>
                </InputWrap>
                <SubmitWrap> 
                    <Button text={"Leave Review"}/>
                </SubmitWrap>
            </form>
        </MainWrap>
    )
}

Review.getInitialProps = async(ctx) => {
    functions.auth(ctx);
    return { user: ctx.req.session.passport.user, driverID:ctx.req.query.driverDetails};
}



export default Review;

