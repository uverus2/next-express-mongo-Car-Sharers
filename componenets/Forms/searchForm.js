import React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import axios from "axios";
import functions from "../../functions";

// Form validation
import { useForm } from 'react-hook-form';
import { string,date, object } from 'yup';

//Components
import Button from "../MainButton";
import ToggleButton from 'react-toggle-button';

const InputWrap = styled.div`
    padding:1rem 0;
    display:flex;
    justify-content:flex-start;
    flex-direction:column;
    input,label{
        width:100%;
    }

    label{
        color:${({theme}) => theme.colors.light};
        font-size:2rem;
    }

    input{
        background:${({theme}) => theme.colors.light};
        min-height:65px;
    }
    .toggleButton{
        padding:0.5rem 0;
    }
`;


const ErrorMessage = styled.h3`
    font-size:2rem;
    color:red;
    padding: 0.5rem 0;
`;

const SubmitWrap = styled.div`
    max-width: 600px;
    padding:1rem 0;

    div button:hover{
        background:${({theme}) => theme.colors.dark};
    }
    
    div button{
        background:transparent;
    }

    @media (max-width:480px) {
       div{
           margin:auto;
        }
    }
`;

const FormWrap = styled.div`
`;

const FromInnerWrap = styled.div`
    display:grid;
    grid-template-columns: minmax(300px, 100%) minmax(300px, 100%);
    grid-gap:1.5rem;
    justify-content: start;

    @media (max-width:740px) {
            grid-template-columns: 1fr;
    }


`;

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

let schema = object().shape({
    fromAddress:string().required("Field is required"),
    toAddress:string().required("Field is required"),
    driveDate:date().required("Field is required").min(tomorrow.toJSON().slice(0,10).replace(/-/g,'-'), "Only a date from tomorrow is allowed. Today is not possible!"),
});

function SearchForm(props) {
    const {onSubmit} = props;
    const { register, handleSubmit,reset, errors } = useForm({validationSchema:schema});

    const handleInnerSubmit = async (data) => {
        onSubmit(data);
        reset();
    };
    
    return (
        <FormWrap>
            <form onSubmit={handleSubmit(handleInnerSubmit)}>
                <FromInnerWrap> 
                    <InputWrap>
                        {errors.fromAddress && (<ErrorMessage> {errors.fromAddress.message} </ErrorMessage>)}
                        <label htmlFor="fromAddress">From</label>
                        <input type="text" name="fromAddress" ref={register}/>
                    </InputWrap>
                    <InputWrap>
                        {errors.toAddress && (<ErrorMessage> {errors.toAddress.message} </ErrorMessage>)}
                        <label htmlFor="toAddress">To</label>
                        <input type="text" name="toAddress" ref={register}/>
                    </InputWrap>
                    <InputWrap>
                        {errors.driveDate && (<ErrorMessage> {errors.driveDate.message} </ErrorMessage>)}
                        <label htmlFor="driveDate">Date</label>
                        <input type="date" name="driveDate" ref={register}/>
                    </InputWrap>
                    <InputWrap>
                        <label htmlFor="driveTime">Time (optional)</label>
                        <input type="time" name="driveTime" ref={register}/>
                    </InputWrap>
                    <SubmitWrap> 
                        <Button text={"Search"}/>
                    </SubmitWrap>
                </FromInnerWrap>
            </form>
        </FormWrap>
    )
}

SearchForm.propTypes = {

}

export default SearchForm

