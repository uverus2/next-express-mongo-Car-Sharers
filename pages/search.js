import React, {useState, useEffect} from 'react';
import functions from "../functions";
import styled from "styled-components";
import axios from "axios";
import Head from 'next/head';


// Components
import Button from "../componenets/MainButton";
import SosButton from "../componenets/SosButton";
import SearchFrom from "../componenets/Forms/SearchForm";
import ToggleButton from 'react-toggle-button';
import Card from "../componenets/Card";

const InputWrap = styled.div`
    padding:1rem 0;
    display:flex;
    justify-content:center;
    flex-direction:column;
    input,label{
        width:100%;
    }

    label{
        font-size:2rem;
        color:${({theme}) => theme.colors.light};
    }

    .toggleButton{
        padding:0.8rem 0;
    }
`;


const MainWrap = styled.div`
    text-align:center;
`;

const HeroSection = styled.div`
    margin-top:-2.7%;
    background:url("images/hero-search.jpg");
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
`;

const InnerHero = styled.div`
    height:100%;
    padding:5% 15rem 3rem;
    @media (max-width:1024px) {
        padding:5% 10rem 3rem;
    }
    @media (max-width:900px) {
        padding:5% 3rem 3rem;
    }
    @media (max-width:480px) {
        padding-left:0;
        padding-right:0;
    }
`;

const ButtonWrap = styled.div`

    max-width: 250px;

    div{
        margin:0;
        padding:1rem 0;
        box-sizing: border-box;
    }

    a{
        width:auto;
    }

    div button:hover{
        background:${({theme}) => theme.colors.dark};
    }
    
    div button{
        background:transparent;
    }

`;

const MainContent = styled.div`
    padding:3rem 15rem 3rem;
    @media (max-width:1024px) {
        padding:2rem 10rem 3rem;
    }
    @media (max-width:900px) {
        padding:2rem 3rem 3rem;
    }
    @media (max-width:480px) {
        padding-left:0;
        padding-right:0;
    }

`;

const Filters = styled.div`
    text-align:left;
`;

const InnerFilters = styled.div`
    background:${({theme}) => theme.colors.secondary};
    padding:2rem;
    border-radius: 5rem;
    transition:1s;
    margin-bottom:2rem;
`;


const Cards = styled.div`
    display:grid;
    grid-template-columns: repeat( auto-fill, minmax(250px, 700px));
    grid-gap:1rem;
    justify-content: center;
`;


function Search(props) {
    const {query, user} = props;

    const [showFilters, setShowFilter] = useState(false);

    const [valueState, setValue] = useState(false);
    const [checked, setChecked] = useState(false);

    const [valueStateTwo, setValueTwo] = useState(false);
    const [checkedTwo, setCheckedTwo] = useState(false);

    const [latestDrives, setLatestDrives] = useState([]);
    const [originalDrives, setOriginalDrives] = useState([]);

    const toggleFilterOption = () => {
        const value = !checked;
        setValue(!valueState);
        setChecked(!valueState);
        if(value){
            const genderFilterArray = latestDrives.filter(i => i.driver.user.gender === user.gender);
            console.log(genderFilterArray);
            setLatestDrives(genderFilterArray)
        }

        if(value === false){
            setLatestDrives(originalDrives);
        }
    };

    const toggleFilterOptionTwo = () => {
        const value = !checkedTwo;
        setValueTwo(!valueStateTwo);
        setCheckedTwo(!valueStateTwo);

        if(value){
            console.log(latestDrives[0].driver.user.interests);
            console.log(user.interests)
            const interestsFilterArray = latestDrives.filter(i => user.interests.some(r => i.driver.user.interests.includes(r)));
            console.log(interestsFilterArray);
            setLatestDrives(interestsFilterArray);
        }

        if(value === false){
            setLatestDrives(originalDrives);
        }
    };

    const showFilter = () => {
        setShowFilter(!showFilters);
    };

    const searchSubmit = async (data) => {
        try{   
            const date = `${data.driveDate.getDate()}/${data.driveDate.getMonth() + 1}/${data.driveDate.getFullYear()}`;
            const searchData = await axios(functions.getOptionsObject(`/drives/search?location=${data.fromAddress}&to=${data.toAddress}&driveDate=${date}&time=${data.driveTime}`));
            setLatestDrives(searchData.data);
            setOriginalDrives(searchData.data);
        }catch(e){
            console.log(e)
        }
    };

    useEffect(() => {
        (async () => {
            try{
                const driverData = await axios(functions.getOptionsObject(`/drives/search?location=${query.location}&to=${query.to}&driveDate=${query.date}&time=${query.time}`));
                const filteredArray = driverData.data.filter(i => i.driver.user._id !== user._id);
                setLatestDrives(filteredArray);
                setOriginalDrives(filteredArray);
            }catch(e){
                console.log(e);
            }
        })();
    }, []);



    const cards = latestDrives.map(i => {
        return  <Card  user={i} clickInfo={i.slug} key={i.slug}/>
    });

    return (
        <MainWrap>
            <Head>
                <title>Car Sharers - Search</title>
            </Head>
            <HeroSection>
                <InnerHero>
                    <h1>Your Results</h1>
                    <SearchFrom onSubmit={searchSubmit}/>
                </InnerHero>
            </HeroSection>
            <SosButton/>
            <MainContent> 
                <h1> Search Results </h1>
                <Filters> 
                    <img onClick={showFilter} src="images/Filters.png"/>
                    {showFilters && (
                    <InnerFilters> 
                        <InputWrap>
                            <label> Would you like you prefer to have the same gender as your driver?</label>
                            <ToggleButton className="toggleButton" inactiveLabelStyle={{color:"#034732"}} trackStyle={{width:"70px", height:"30px"}}  inactiveThumbStyle={{left:"5px"}}  activeLabelStyle={{color:"#C2F970"}} colors={{activeThumb:{base:"#C2F970"},active:{base:"#034732"} , inactive:{base:"#C2F970"}, inactiveThumb:{base:"#034732"}}} inactiveLabel={"No"} activeLabel={"Yes"} value={valueState || false } onToggle={toggleFilterOption} />
                            <input className="hide" type="text" name="toggle" value={checked} readOnly />
                        </InputWrap>
                        <InputWrap>
                            <label>Would you like for the driver to have simmilar interests?</label>
                            <ToggleButton className="toggleButton" inactiveLabelStyle={{color:"#034732"}} trackStyle={{width:"70px", height:"30px"}}  inactiveThumbStyle={{left:"5px"}}  activeLabelStyle={{color:"#C2F970"}} colors={{activeThumb:{base:"#C2F970"},active:{base:"#034732"} , inactive:{base:"#C2F970"}, inactiveThumb:{base:"#034732"}}} inactiveLabel={"No"} activeLabel={"Yes"} value={valueStateTwo || false } onToggle={toggleFilterOptionTwo} />
                            <input className="hide" type="text" name="toggle" value={checkedTwo} readOnly />
                        </InputWrap>
                    </InnerFilters>)}
                </Filters>
                {cards.length <= 0 && (<h1> No Results Found </h1>)}
                <Cards>
                    {cards}
                </Cards>
            </MainContent>
        </MainWrap>
    )
}

Search.getInitialProps = async(ctx) => {
    functions.auth(ctx);

    return { user: ctx.req.session.passport.user, query:ctx.req.query};
}

export default Search

