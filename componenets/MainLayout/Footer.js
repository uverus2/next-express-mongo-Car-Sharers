import React from 'react';
import styled from "styled-components";


const FooterDevider = styled.div`
    width:100%;
    img{
        width:100%;
        max-height:120px;
    }
`;

const FooterContent = styled.div`
    margin-top:-3px;
    background:${({theme}) => theme.colors.secondary};
    display:grid;
    grid-gap:2rem;
    grid-template-areas:
        "logo . social"
        "logo . email"
        "links links links";

    padding:5rem 15rem 0rem;
    @media (max-width:1024px) {
        padding:5rem 10rem 0rem;
    }
    @media (max-width:900px) {
        padding:5rem 3rem 0rem;
    }
    @media (max-width: 740px) {
        padding:3rem 0rem 0rem;
        justify-content:center;
        grid-template-areas:
            "logo"
            "social"
            "email"
            "links";
    }
`;

const Email = styled.div`
    grid-area:email;
    display:flex;
    flex-direction:row;
    justify-content:flex-end;
    align-items: center;
    color:${({theme}) => theme.colors.dark};
    img{
        width:auto;
        height:50px;
        margin-left:1.5rem;
    }
    h2{
        color:${({theme}) => theme.colors.info};
        width:auto;
        padding:0;
    }

    @media (max-width: 740px) {
        justify-content:center;
        img{
            height:35px;
        }
        h2{
            font-size: 2.5rem;
        }
    }
`;

const SocialIcons = styled.div`
        grid-area:social;
        display:flex;
        flex-direction:row;
        justify-content:flex-end;
        text-align: right;

    img{
        width:50px;
        height:50px;
        margin-left:10rem;
    }

    @media (max-width: 740px) {
        justify-content:space-evenly;
        img{
            margin-left:0;
            height:30px;
        }
    }
    
`;

const FooterLogo = styled.div`
    grid-area:logo;
    img{
        width:100%;
        max-width:450px;
    }

    @media (max-width: 740px) {
        margin:auto;
        img{
            max-width:200px;
        }
    }
`;

const MoreLinks = styled.div`
    grid-area:links;
    text-align:center;
    padding:0.5rem 0 1.5rem;
    a,p{
        font-size:2rem;
        padding:1rem 0;
        width:100%;
        display: block;
        color:${({theme}) => theme.colors.light};
    }
    a:hover{
        color:${({theme}) => theme.colors.dark};
    }

    @media (max-width: 740px) {
        a,p{
            font-size:1.5rem;
            padding:0.5rem 0;
        }
    }


`;
function Footer(props) {
    return (
        <div>
            <FooterDevider> 
                <img src="images/footer-devider.png"/>
            </FooterDevider>
            <FooterContent>
                <FooterLogo> 
                    <img src="images/footer-logo.svg" alt=""/>
                </FooterLogo>
                <SocialIcons>
                        <img src="images/linkedin.svg" alt="Linked In"/>
                        <img src="images/facebook.svg" alt="Facebook"/>
                        <img src="images/twitter.svg" alt="Twitter"/>
                </SocialIcons>
                <Email>
                    <h2>Get in touch</h2>
                    <img src="images/email-icon.svg" alt=""/>
                </Email>
                <MoreLinks> 
                    <a href="#">Terms and Conditions</a>
                    <a href="#">Privacy Policy</a>
                    <p>© Carsharers 2010 — 2020</p>
                </MoreLinks>
                
            </FooterContent>
        </div>
    )
}

export default Footer

