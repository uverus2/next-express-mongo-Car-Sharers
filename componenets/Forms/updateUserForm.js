import React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import axios from "axios";
import functions from "../../functions";

// Form validation
import { useForm } from 'react-hook-form';
import { string,ref,number, object } from 'yup';

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

const currentYear = new Date().getFullYear();

let schema = object().shape({
    email: string().email("It must be a valid email").required("Field is required"),
    fullName:string().required("Field is required"),
    interests:string().required("Field is required"),
    gender:string().required("Field is required"),
    numberPlate:string().when("toggle",{
        is:"true",
        then: string().required("Field is required").max(7,"Cannot be longer than 7 characters")
    }),
    brand:string().when("toggle",{
        is:"true",
        then: string().required("Field is required")
    }),
    model:string().when("toggle",{
        is:"true",
        then: string().required("Field is required")
    }),
    phone:number().when("toggle",{
        is:"true",
        then: number().typeError('Age must be a number').required("Field is required")
    }),
    postCode:string().when("toggle",{
        is:"true",
        then: string().required("Field is required").min(6, "It must be no less than 6 characters").max(8, "It must be no more than 8 characters")
    }),
    address:string().when("toggle",{
            is:"true",
            then: string().required("Field is required")
    }),
    year:number().when("toggle",{
        is:"true",
        then: number().typeError('Year must be a number').required("Field is required").min(1980, "It must be no less than 4 characters").max(currentYear, "It must be no more than 4 characters")
    }),
    fuel:string().when("toggle",{
        is:"true",
        then: string().required("Field is required")
    }),
});

function loginForm(props) {
    const {onSubmit, user} = props;
    const { register, handleSubmit,reset, errors } = useForm({validationSchema:schema});
    const [valueState, setValue] = useState(false);
    const [checked, setChecked] = useState(false);
    const [numberPlateCheck, setNumberPlateCheck] = useState(false);

    //Multiselect 
    const [interestsValue, setInterestsValue] = useState([]);
    const [interestsList, setInterestsList] = useState(["Sports", "Classical Movies","Web Development", "Comedies"]);
    const [driver, setDriver] = useState("");
    const [car, setCar] = useState("");

    const handleCreate = (name) => {
        setskillsValue([...interestsValue,name]);
        setskillsList([...interestsList,name]);
    };
    

    const changeArray = (value) => setInterestsValue(value);

    useEffect(()=> {
            (async() => {
                try{

                    setInterestsValue(user.interests);
                    const options = functions.getOptionsObject(`/driver/${user._id}`);
                    const driverData = await axios(options);
                    if(driverData.data !== null){
                        const carOptions = functions.getOptionsObject(`api/cars/driver/${driverData.data._id}`);
                        const carData = await axios(carOptions);
                        setCar(carData.data);
                        setValue(true);
                        setChecked(true);
                        setDriver(driverData.data);
                    }

                }catch(e){
                    console.log(e);
                    setDriver("");
                    setCar("");
                }
            })();

    },[]);

    const toggleDriver = () => {
            setValue(!valueState);
            setChecked(!valueState);
    };

    const handleInnerSubmit = async (data,e) => { 
        if(typeof data.numberPlate !== "undefined"){
            try{
                if(car.numberPlate !== data.numberPlate.toLowerCase()){
                    const isNumberPlateValid = await axios(functions.getOptionsObject(`api/car/numberPlate/${data.numberPlate.toLowerCase()}`));
                    if(!isNumberPlateValid.data) {
                        setNumberPlateCheck(true);
                        e.preventDefault();
                    }else{
                        setNumberPlateCheck(false);
                        onSubmit(data);
                        reset();
                    }
                }else{
                    setNumberPlateCheck(false);
                    onSubmit(data);
                    reset();
                }
                return;
            }catch(e){
                console.log(e)
            }
        }
        reset();
    };


    return (
        <FormWrap>
            <form onSubmit={handleSubmit(handleInnerSubmit)}>
                <InputWrap>
                    {errors.email && (<ErrorMessage> {errors.email.message} </ErrorMessage>)}
                    <label htmlFor="email">Email</label>
                    <input type="text" defaultValue={user.email} name="email" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.fullName && (<ErrorMessage> {errors.fullName.message} </ErrorMessage>)}
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" className="capitalLetter" name="fullName" defaultValue={user.fullName} ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.interests && (<ErrorMessage> {errors.interests.message} </ErrorMessage>)}
                    <label htmlFor="interests">Interests</label>
                    <input type="hidden" value={interestsValue} name="interests" ref={register} readOnly/>
                    <Multiselect className="multi"  data={interestsList} value={interestsValue} allowCreate="onFilter" onCreate={name => handleCreate(name)} onChange={value => changeArray(value) } textField="name" />
                </InputWrap>
                <GenderWrap>
                    {errors.gender && (<ErrorMessage> {errors.gender.message} </ErrorMessage>)}
                    <label htmlFor="gender">Gender</label>
                    <GenderSelect>
                        <div>
                            <label className="genderInput" htmlFor="male">Male
                                <input type="radio" id="male" name="gender" value="male" ref={register}/>
                            </label>
                        </div>
                        <div>
                            <label className="genderInput" htmlFor="female">Female
                                <input type="radio" id="female" name="gender" value="female" ref={register}/>
                            </label>
                        </div>
                        <div>
                            <label className="genderInput" htmlFor="other">Other
                                <input type="radio" id="other" name="gender" value="other" ref={register}/>
                            </label>
                        </div>
                    </GenderSelect>
                </GenderWrap>
                <InputWrap>
                    <label> Would you be interested in drivings ?</label>
                    <ToggleButton className="toggleButton" inactiveLabelStyle={{color:"#034732"}} trackStyle={{width:"70px", height:"30px"}}  inactiveThumbStyle={{left:"5px"}}  activeLabelStyle={{color:"#C2F970"}} colors={{activeThumb:{base:"#C2F970"},active:{base:"#034732"} , inactive:{base:"#C2F970"}, inactiveThumb:{base:"#034732"}}} inactiveLabel={"No"} activeLabel={"Yes"} value={valueState || false } onToggle={toggleDriver} />
                    <input className="hide" type="text" name="toggle" value={checked} readOnly ref={register} />
                </InputWrap>
                {valueState && (<>
                <InputWrap>
                    {errors.numberPlate && (<ErrorMessage> {errors.numberPlate.message} </ErrorMessage>)}
                    {numberPlateCheck && <ErrorMessage>Number Plate already registered</ErrorMessage> }
                    <label htmlFor="numberPlate">Number Plate</label>
                    <input type="text" className="uppercaseLetter" defaultValue={car.numberPlate} name="numberPlate" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.brand && (<ErrorMessage> {errors.brand.message} </ErrorMessage>)}
                    <label htmlFor="brand">Brand</label>
                    <input type="text" className="capitalLetter" name="brand" defaultValue={car.brand} ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.model && (<ErrorMessage> {errors.model.message} </ErrorMessage>)}
                    <label htmlFor="model">Model</label>
                    <input type="text" className="capitalLetter" defaultValue={car.model} name="model" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.phone && (<ErrorMessage> {errors.phone.message} </ErrorMessage>)}
                    <label htmlFor="phone">Phone Number</label>
                    <input type="number" defaultValue={driver.phone} name="phone" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.postCode && (<ErrorMessage> {errors.postCode.message} </ErrorMessage>)}
                    <label htmlFor="postCode">Post Code</label>
                    <input type="text" className="uppercaseLetter" defaultValue={driver.postcode}  name="postCode" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.address && (<ErrorMessage> {errors.address.message} </ErrorMessage>)}
                    <label htmlFor="address">Address</label>
                    <input type="text" className="capitalLetter" defaultValue={driver.address} name="address" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.year && (<ErrorMessage> {errors.year.message} </ErrorMessage>)}
                    <label htmlFor="year">Year</label>
                    <input type="number" defaultValue={car.year} name="year" ref={register}/>
                </InputWrap>
                <InputWrap>
                    {errors.fuel && (<ErrorMessage> {errors.fuel.message} </ErrorMessage>)}
                    <label htmlFor="fuel">Fuel Type</label>
                    <select name="fuel" ref={register} defaultValue={car.fuelType}>
                        <option value="diesel">Diesel</option>
                        <option value="petrol">Petrol</option>
                    </select>
                </InputWrap>
                </>)}
                <SubmitWrap> 
                    <Button text={"Update Now"}/>
                </SubmitWrap>
            </form>
        </FormWrap>
    )
}

loginForm.propTypes = {

}

export default loginForm

