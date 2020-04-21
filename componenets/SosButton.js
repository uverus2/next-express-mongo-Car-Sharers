import React from 'react';
import styled from "styled-components";


const SosButtonWrap = styled.div`
    width:100%;
    height:65px;
    background:${({theme}) => theme.colors.secondary};
    display: flex;
    align-items: center;
    justify-content: center;

    div{
        width:100px;
        height:100px;
        border-radius:100%;
        border: 1.5rem solid rgba(255,255,255, 0.7);
        background-clip: padding-box;
        background:${({theme}) => theme.colors.dark};
        display:flex;
        align-items:center;
        
        h1{
            color:${({theme}) => theme.colors.secondary};
            margin: auto;
        }
    }

`;

function SosButton () {
    return(
    <SosButtonWrap>
        <div>
            <h1>SOS</h1>
        </div>
    </SosButtonWrap>
    )
}

export default SosButton
