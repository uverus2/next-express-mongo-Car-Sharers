import React , {useState, useEffect} from 'react';
import functions from "../../functions";
import styled from "styled-components";
import axios from "axios";

import Menu from "../Menu";

const HeaderWrap = styled.div`
    .devider{
        width:100%;
        height:100%;
        min-height:100%;
    }
`;

const GreetingName = styled.div`
    grid-area:greeting;

    h2{
        color:${({theme}) => theme.colors.dark};
        font-size:2.7rem;
        padding:1.5rem 0;
    }

    @media (max-width: 740px) {
        text-align:center;
    }
`;

const MainsWrap = styled.div`
    padding:5rem 15rem 0rem;
    @media (max-width:1024px) {
        padding:5rem 10rem 0rem;
    }
    @media (max-width:900px) {
        padding:5rem 3rem 0rem;
    }
    @media (max-width: 740px) {
        padding:3rem 0rem 0rem;
    }

`;

const LogoHeaderWrap = styled.div`
    display:grid;
    grid-gap:1rem;
    padding-bottom:1rem;
    grid-template-areas:
    "logo menu"
    "greeting greeting";

    @media (max-width: 740px) {
        grid-template-areas:
        "logo logo"
        "greeting menu";
        grid-row-gap:2rem;
    }
`;

const LogoWrap = styled.div`
    grid-area: logo;
    display:flex;

    img{
        width:100%;
        max-width:300px;
    }

    @media (max-width: 740px) {
        justify-content:center;
    }

`;
const MenuIconWrap = styled.div`
grid-area: menu;
display:flex;
justify-content:flex-end;
img{
    width:50px;
}

:hover{
    transition:1s;
    img{
        padding:0.5rem;
        box-sizing:border-box;
    }
}

@media (max-width: 740px) {
    justify-content:center;
    img{
        width:30px;
        padding:0 1rem;
    }
}`;

function Header(props) {
    const [open, setOpen] = useState(false);
    const [isDriverPresent, setIsDriverPresent] = useState(true);
    const {name, userID} = props;


    useEffect(() => {
        (async() => {
            try {
                const driverCheck = await axios(functions.getOptionsObject(`/driver/exists/${userID}`));
                console.log(driverCheck.data);
                setIsDriverPresent(driverCheck.data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    const openMenu = () => {
        setOpen(!open);
        open === false ? document.body.style.overflowY = "hidden" : document.body.style.overflowY = "scroll";
    };

    return (
        <>
        <Menu isDriver={isDriverPresent} menuClick={openMenu} open={open}/>
        <HeaderWrap>
            <MainsWrap>
            <LogoHeaderWrap> 
                <LogoWrap>
                    <img src="images/logo.svg" alt=""/>
                </LogoWrap>
                <MenuIconWrap>
                    <img onClick={openMenu} src="images/menu-icon.svg" alt=""/>
                </MenuIconWrap>
                <GreetingName> 
                    <h2>Hello {name} <a href="auth/logout">(Log Off)</a></h2>
                </GreetingName>
            </LogoHeaderWrap>
            </MainsWrap>
            <img className="devider" src="images/Group 31.svg"/>
        </HeaderWrap>
        </>
    )
}

Header.defaultProps = {
    name:"Konstantin"
}

export default Header;

