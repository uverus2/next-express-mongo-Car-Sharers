import React from 'react';
import styled from "styled-components";
import Head from 'next/head';


// Components 
import Logo from "../componenets/MainLayout/CenteredLogo";
import Button from "../componenets/MainButton";
import SecondaryButton from "../componenets/SecondaryButton";

const Devider = styled.div`
    img{
        width:100%;
    }
    padding:2rem 0;

    @media (max-width: 740px) {
        padding:0;
        img{
            min-height:5rem;
        }
    }
`;

const MainWrap = styled.div`
    text-align: center;
    width:100%;

    p{
        font-size:2.6rem;
    }

    @media (max-width: 740px) {
        p{
            font-size:2rem;
        }
        h1{
            font-size:3rem;
        }
    }
`;

const MainContentWrap = styled.div`
    padding:2rem 15rem 0rem;
    box-sizing:border-box;
    @media (max-width:1024px) {
        padding:2rem 10rem 0rem;
    }
    @media (max-width:900px) {
        padding:2rem 3rem 0rem;
    }
    @media (max-width:480px) {
        padding-left:0;
        padding-right:0;
    }
`;

const MainContent = styled.div`
    display:grid;
    grid-template-columns:1fr 1fr;
    grid-template-areas:"content image";
    text-align:left;
    justify-items: center;
    @media (max-width: 740px) {
        grid-template-columns:1fr;
        grid-template-areas:
        "image"
        "content";
    }
`;

const WelcomeContent = styled.div`
    text-align:left;
    grid-area:content;
    h1,p {
        padding:1.8rem 0;
    }
    div{
        padding:0.5rem 0;
        margin:0;
    }

    @media (max-width: 740px) {
        div{
            margin:auto;
        }
    }
`;

const MainImageWrap = styled.div`
    grid-area:image;
    img{
        width:100%;
        min-width:700px
    }

    @media (max-width:1200px) {
        img{
            min-width:500px;
        }
    }

    @media (max-width:1024px) {
        img{
            min-width:100%;
        }
    }
`;

const OtherContent = styled.div`
display:grid;
padding:2rem 0;
grid-template-columns:1fr 1fr;
text-align:left;
justify-items: center;
justify-content:center;
align-items:center;
grid-gap:2rem;

div img{
    width:100%;
    max-width: 400px;
    margin:auto;
}

h1{
    padding-bottom:2rem;
}

ul{
    padding-left:1rem;
}

ul li {
    position: relative;
    color:${({theme}) => theme.colors.main};
    ${({theme}) => theme.font.regular};
    padding:1rem 0 1rem 3rem;
}

ul li:before{
    position: absolute;
    content:"";
    width:10px;
    left:0;
    margin-top: 0.5rem;
    margin-left: 0.2rem;
    border-radius:100%;
    height:10px;
    background:${({theme}) => theme.colors.dark};
}

@media (max-width: 740px) {
    grid-template-columns:1fr;
}
`;

const ButtonWrap = styled.div`
    display:flex;
    flex-direction:row;
    justify-content: space-evenly;
    div{
        margin:0;
    }

    a{
        width:100%;
    }

    div:first-child button:hover{
        background:${({theme}) => theme.colors.secondary};
    }
    
    div:nth-child(2) button{
        background:${({theme}) => theme.colors.secondary};
    }

    div:nth-child(2) button:hover{
        background:${({theme}) => theme.colors.dark};
    }

`;

const RectDevider = styled.div`
    margin:2rem 0;
    ${MainContentWrap} {
        background:${({theme}) => theme.colors.secondary};
        h2{
            color:${({theme}) => theme.colors.light};
        }
        padding-top:3rem;
        padding-bottom:3rem;
        grid-gap:2rem;
        display:grid;
        box-sizing:border-box;
        text-align:left;
        grid-template-columns:1fr 1fr;
        justify-content:center;
        align-items: center;

        @media (max-width: 740px) {
            padding-top:2rem;
            padding-bottom:2rem;
            grid-template-columns:1fr 0.5fr;
            ${ButtonWrap}{
                flex-direction:column;
                div{
                    padding:1rem 0;
                }
            }
        }

        @media (max-width: 480px) {
            grid-template-columns:1fr;
            text-align: center;
            ${ButtonWrap}{
                flex-direction:column;
                justify-content:center;
                div{
                    margin:auto;
                    padding:1rem 0;
                }
            }
        }
    }
`;

const SectionWrap = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    text-align:left;

    img{
        padding:1rem 0rem;
    }
`;

function Landing(props) {
    return ( 
        <MainWrap>
            <Head>
                <title>Car Sharers - Landing</title>
            </Head>
            <Logo/>
            <MainContentWrap>
                <MainContent>
                    <WelcomeContent>
                        <h1>Ready to get started?</h1>
                        <p>Car sharers is a service that allows you to find your perfect commute partner. Whether you are commuting to work, an event or one-off trip we can be of service. </p>
                        <a href="/register"><SecondaryButton text="Sign me up" /> </a>
                        <a href="/login"><Button text="Log In"/> </a>
                    </WelcomeContent>
                    <MainImageWrap>
                        <img src="images/mainLP.jpg" alt=""/>
                    </MainImageWrap>
                </MainContent>
            </MainContentWrap>
            <Devider>
                <img src="images/LP-top-devider.png" alt=""/>
            </Devider>
            <MainContentWrap>
                <OtherContent>
                    <div>
                        <h1>Why car share?</h1>
                        <p>Car sharing is a great opportunity to help or environment by making your daily commute a little bit more fun. </p>
                        <ul>
                            <li>Save Money</li>
                            <li>Save our Planet</li>
                            <li>Make your daily commute more interesting</li>
                        </ul>
                    </div>
                    <div>
                        <img src="images/traffic.png" alt=""/>
                    </div>
                </OtherContent>
            </MainContentWrap>
            <Devider>
                <img src="images/LP-bottom-devider.png" alt=""/>
            </Devider>
            <MainContentWrap>
                <h1>Why are we different?</h1>
                <p>Our mission statement is to decrease the cars on the road, reduce the traffic but benefit you at the same time. We aim to make your journey more pleasant whether you are a driver or a passenger we value you.</p>
                <OtherContent> 
                    <SectionWrap>
                        <img src="images/money.png" alt=""/>
                        <p>We will calculate the exact price of the joyrney plus 20% service charge for the driver. </p>
                    </SectionWrap>
                    <SectionWrap>
                        <img src="images/connection.png" alt=""/>
                        <p>You can match a driver based on your interests. Drivers have the option to choose who they drive </p>
                    </SectionWrap>
                </OtherContent>
            </MainContentWrap>
            <RectDevider> 
                <MainContentWrap>
                    <div>
                        <h1>Ready to get started?</h1>
                        <h2>Log In or Register</h2>
                    </div>
                    <ButtonWrap>
                    <a href="/register"> <SecondaryButton text="Register Me" /> </a>
                    <a href="/login"> <Button text="Log In"/> </a>
                    </ButtonWrap>
                </MainContentWrap>
            </RectDevider>
            <OtherContent>
                <div>
                    <img src="images/navigation.png" alt=""/>
                </div>
                <div>
                    <h1>Traffic Updates?</h1>
                    <p>We provide you with a service that displays a map of your journey along with the latest events happening on your road. </p>
                </div>
            </OtherContent>
        </MainWrap>
    )
}


export default Landing