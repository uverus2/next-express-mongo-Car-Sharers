import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

const Button = styled.button`
    padding:1rem;
    border:solid 2px ${({theme}) => theme.colors.dark};
    color:${({theme}) => theme.colors.dark};
    ${({theme}) => theme.font.main};
    width:100%;
    font-size:1.5rem;
    background:#ffffff;
    border-radius:6px;
    :active, :focus{
        outline:none;
    }
    :hover{
        color:${({theme}) => theme.colors.light};
        background:${({theme}) => theme.colors.dark};
    }
`;

const ButtonWrap = styled.div`
    width:100%;
    max-width:250px;
`;
function MainButton(props) {
    const {text, onClick} = props;
    return (
        <ButtonWrap>
            <Button onClick={onClick}>{text}</Button>
        </ButtonWrap>
    )
}


MainButton.defaultProps = {
    text:"Click Me"
}

export default MainButton

