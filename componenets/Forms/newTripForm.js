import React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import axios from "axios";
import functions from "../../functions";

// Form validation
import { useForm } from 'react-hook-form';
import { string,date, object } from 'yup';

//Components
import Button from "../SecondaryButton";
import { Multiselect } from 'react-widgets';
import ToggleButton from 'react-toggle-button';

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

    .toggleButton{
        padding:0.5rem 0;
    }
`;

const GenderWrap = styled.div`
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

const GenderSelect = styled.div`
    display:flex;
    padding:0.5rem 0;
    flex-direction:row;
    justify-content:space-evenly;

    input[type="radio"]{
        height: 2rem;
        width:2rem;
        opacity:0;
        z-index:3;
        display:block;
        border-radius:100px;
        border: solid 1px ${({theme}) => theme.colors.dark};
        appearance: none;
        position:absolute;
        top:32.5px;
        left:9px;
    }

    input[type="radio"]:checked {
        background:${({theme}) => theme.colors.dark};
        opacity:1;
        z-index:3;
    }

    .genderInput{
        position:relative;
        display:block;
    }

    .genderInput:after {
        content: "";
        height:3.5rem;
        width: 3.5rem;
        border-radius:100%;
        display: block;
        background:${({theme}) => theme.colors.light};
        border:solid 2px ${({theme}) => theme.colors.dark};
        position: relative;
        left: 0;
        top: 15px;
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
    margin: auto;
`;

const FormWrap = styled.div`
    padding-bottom:3rem;
`;

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

let schema = object().shape({
    fromAddress:string().required("Field is required"),
    fromTown:string().required("Field is required"),
    toAddress:string().required("Field is required"),
    toTown:string().required("Field is required"),
    driveDate:date().required("Field is required").min(tomorrow.toJSON().slice(0,10).replace(/-/g,'-'), "Only a date from tomorrow is allowed. Today is not possible!"),
    driveTime:string().required("Field is required"),
    driveTimeReturn:string().when("toggle",{
        is:"true",
        then: string().required("Field is required")
    }),
    driveDateReturn:date().when("toggle",{
        is:"true",
        then: date().required("Field is required")
    }),
});

function loginForm(props) {
    const {onSubmit} = props;
    const { register, handleSubmit,reset, errors } = useForm({validationSchema:schema});
    const [valueState, setValue] = useState(false);
    const [checked, setChecked] = useState(false);

    // Validation 
    const [fromAddressCheck, setFromAddressCheck] = useState(false);
    const [toAddressCheck, setToAddressCheck] = useState(false);
    const [dateCheck, setDateCheck] = useState(false);
    
    const toggleDriver = () => {
        setValue(!valueState);
        setChecked(!valueState);
    };

    const handleInnerSubmit = async (data,e) => {
        const fromLocation = await axios(functions.getOptionsObject(`https://maps.googleapis.com/maps/api/geocode/json?address=${data.fromAddress} ${data.fromTown}&key=AIzaSyBGyGQFFfxzl1AyyHVM1zhxFUKpsQdkIjg`)),
        toLocation = await axios(functions.getOptionsObject(`https://maps.googleapis.com/maps/api/geocode/json?address=${data.toAddress} ${data.toTown}&key=AIzaSyBGyGQFFfxzl1AyyHVM1zhxFUKpsQdkIjg`)),
        travelTime = data.driveTime.split(":");

        data.driveDate.setHours(travelTime[0]);
        data.driveDate.setMinutes(travelTime[1]);

        if(fromLocation.data.status === "ZERO_RESULTS"){
            console.log("1")
            setFromAddressCheck(true);
            setToAddressCheck(false);
            e.preventDefault();
        }else if(toLocation.data.status === "ZERO_RESULTS") {
            console.log("2")
            setToAddressCheck(true);
            setFromAddressCheck(false)
            e.preventDefault();
        }else{
            setFromAddressCheck(false);
            setToAddressCheck(false);
            if(data.toggle === "true"){
                const returnTime = data.driveTimeReturn.split(":");
                data.driveDateReturn.setHours(returnTime[0]);
                data.driveDateReturn.setMinutes(returnTime[1]);

                if(data.driveDate > data.driveDateReturn){
                    setDateCheck(true);
                    e.preventDefault();
                }else{
                    setDateCheck(false);
                    onSubmit(data,fromLocation.data,toLocation.data);
                    reset();
                }
            }
            onSubmit(data,fromLocation.data,toLocation.data);
            reset();
        }
    };
    
    return (
        <FormWrap>
            <form onSubmit={handleSubmit(handleInnerSubmit)}>
                {fromAddressCheck && (<ErrorMessage> From Location not found. Please ensure it is entered correctly </ErrorMessage>)}
                {toAddressCheck && (<ErrorMessage> To Location not found. Please ensure it is entered correctly </ErrorMessage>)}
                {dateCheck && (<ErrorMessage> Ensure Return date is bigger than the Start date </ErrorMessage>)}
                <InputWrap>
                    {errors.fromAddress && (<ErrorMessage> {errors.fromAddress.message} </ErrorMessage>)}
                    <label htmlFor="fromAddress">From Address</label>
                    <input type="text" name="fromAddress" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.fromTown && (<ErrorMessage> {errors.fromTown.message} </ErrorMessage>)}
                    <label htmlFor="fromTown">From Town</label>
                    <input type="text" name="fromTown" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.toAddress && (<ErrorMessage> {errors.toAddress.message} </ErrorMessage>)}
                    <label htmlFor="toAddress">To Address</label>
                    <input type="text" name="toAddress" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.toTown && (<ErrorMessage> {errors.toTown.message} </ErrorMessage>)}
                    <label htmlFor="toTown">To Town</label>
                    <input type="text" name="toTown" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.driveDate && (<ErrorMessage> {errors.driveDate.message} </ErrorMessage>)}
                    <label htmlFor="driveDate">Date</label>
                    <input type="date" name="driveDate" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.driveTime && (<ErrorMessage> {errors.driveTime.message} </ErrorMessage>)}
                    <label htmlFor="driveTime">Time</label>
                    <input type="time" name="driveTime" ref={register}/>
                </InputWrap>
                <InputWrap>
                    <label> Would you like to add a return trip ?</label>
                    <ToggleButton className="toggleButton" inactiveLabelStyle={{color:"#034732"}} trackStyle={{width:"70px", height:"30px"}}  inactiveThumbStyle={{left:"5px"}}  activeLabelStyle={{color:"#C2F970"}} colors={{activeThumb:{base:"#C2F970"},active:{base:"#034732"} , inactive:{base:"#C2F970"}, inactiveThumb:{base:"#034732"}}} inactiveLabel={"Yes"} activeLabel={"No"} value={valueState || false } onToggle={toggleDriver} />
                    <input className="hide" type="text" name="toggle" value={checked} readOnly ref={register} />
                </InputWrap>
                {valueState && (<>
                    <InputWrap>
                    {errors.driveDateReturn && (<ErrorMessage> {errors.driveDateReturn.message} </ErrorMessage>)}
                    <label htmlFor="driveDateReturn">Date</label>
                    <input type="date" name="driveDateReturn" ref={register}/>
                    </InputWrap>
                    <InputWrap>
                        {errors.driveTimeReturn && (<ErrorMessage> {errors.driveTimeReturn.message} </ErrorMessage>)}
                        <label htmlFor="driveTimeReturn">Time</label>
                        <input type="time" name="driveTimeReturn" ref={register}/>
                    </InputWrap>
                </>)}
                <SubmitWrap> 
                    <Button text={"Submit Offer"}/>
                </SubmitWrap>
            </form>
        </FormWrap>
    )
}

loginForm.propTypes = {

}

export default loginForm

