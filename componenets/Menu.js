import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

const MenuWrap = styled.div`
    transform: ${({ open }) => open ? 'translateX(0%)' : 'translateX(400%)'};
    width:100vw;
    height:100vh;
    display:flex;
    z-index:4;
    position:absolute;
    transition:0.5s;
`;

const LeftSide = styled.div`
    height: 100%;
    width:20%;
    background:${({theme}) => theme.colors.secondary};
    text-align: center;
    img{
        margin-top:10rem;
        width:100%;
        height:50px;
    }

    img:hover{
        transition:0.5s;
        padding:0.5rem;
        box-sizing:border-box;
    }

    @media (max-width: 740px) {
        img{
            height:30px;
        }
    }

    @media (max-width:480px) {
       img{
           margin-top:5rem;
       }
    }
`;

const RightSide = styled.div`
    height: 100%;
    width:80%;
    background:${({theme}) => theme.colors.light};
    text-align:center;
    img{
        margin-top:10rem;
        width:100%;
        max-width:450px;
    }

    @media (max-width: 740px) {
        img{
            max-width:200px;
        }
    }
    @media (max-width:480px) {
       img{
           margin-top:5rem;
       }
    }
`;

const LinkList = styled.ul`
    margin:5rem 0;

    li{
        width:100%;
        padding:5rem 0;
    }

    li a{
        font-size:5rem;
    }

    li:hover{
        background:${({theme}) => theme.colors.dark};
        transition: 1s;
        a{
            color:${({theme}) => theme.colors.light};
            text-decoration:none;
            transition: 0.5s;
        }
    }

    @media (max-width: 740px) {
        margin:3rem 0;
        li{
            font-size:3rem;
            padding:3rem 0;
        }
    }
`;


function Menu(props) {
    const {open,isDriver,menuClick} = props;
    return (
        <MenuWrap open={open}>
            <LeftSide>
                <img onClick={menuClick} src="images/cancel-icon.svg" alt=""/>
            </LeftSide>
            <RightSide>
                <img src="images/logo.svg" alt=""/>
                <LinkList>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/my-trips">My Trips</a>
                    </li>
                    {isDriver === false && (
                        <li>
                            <a href="/my-drives">My Drives</a>
                        </li>
                    )}
                    <li>
                        <a href="/user-profile">Profile</a>
                    </li>
                </LinkList>
            </RightSide>
        </MenuWrap>
    )
}

Menu.propTypes = {

}

export default Menu

