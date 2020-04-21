import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";


const Button = styled.button `
    padding:1rem;
    ${({theme}) => theme.font.main};
    color:${({theme}) => theme.colors.light};
    background:${({theme}) => theme.colors.dark};
    width:100%;
    font-size:1.5rem;
    border-radius:6px;
    border:solid 2px ${({theme}) => theme.colors.dark};
    :active, :focus{
        outline:none;
    }
    :hover{
        color:${({theme}) => theme.colors.dark};
        background:#ffffff;
    }
`;

const ButtonWrap = styled.div `
    width:100%;
    max-width:250px;
    margin:auto;
`;

function MainButton(props) {
    const { text , onClick } = props;
    return ( 
        <ButtonWrap>
            <Button onClick={onClick}> { text } </Button> 
        </ButtonWrap>
    )
}

MainButton.defaultProps = {
    text: "Click Me"
}

export default MainButton