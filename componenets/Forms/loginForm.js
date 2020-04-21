import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

// Form validation
import { useForm } from 'react-hook-form';
import { string, object } from 'yup';

//Components
import Button from "../MainButton";

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
`;

const ErrorMessage = styled.h3`
    font-size:2rem;
    color:red;
    padding: 0.5rem 0;
`;

const SubmitWrap = styled.div`
    display:grid;
    max-width: 600px;
    margin:auto;
    grid-template-columns: minmax(200px,1fr) minmax(200px,1fr);
    justify-content:start;
    padding:0.5rem 0;

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
        justify-items: center;
        grid-row-gap:1rem;
    }
`;

const GoogleWrap = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    justify-items: end;
    align-items:center;
    grid-gap: 1.5rem;
`;

let schema = object().shape({
    email: string().email("It must be a valid email").required("Field is required").max(20,"Only 6 characters"),
    password: string().required("Field is required").min(6, "Password must be larger than 7 characters")
});

function loginForm(props) {
    const {onSubmit} = props;
    const { register, handleSubmit, reset, errors } = useForm({validationSchema:schema});

    const handleInnerSubmit = data => { 
        onSubmit(data);
        reset();
    };
    return (
        <div>
            <form onSubmit={handleSubmit(handleInnerSubmit)}>
                <InputWrap>
                    {errors.email && (<ErrorMessage> {errors.email.message} </ErrorMessage>)}
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.password && (<ErrorMessage> {errors.password.message} </ErrorMessage>)}
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" ref={register}/>
                </InputWrap>
                <SubmitWrap> 
                    <Button text={"Log In"}/>
                    <GoogleWrap> 
                        <h3>Log in with Google </h3>
                        <a href="/auth/google"><img src="images/googleIcon.png" alt=""/></a>
                    </GoogleWrap>
                </SubmitWrap>
            </form>
        </div>
    )
}

loginForm.propTypes = {

}

export default loginForm

