import React from 'react';
import styled from "styled-components";

const LogoWrap = styled.div`
    text-align:center;
    padding:5rem 0;
    img{
        width:100%;
        max-width:300px;
    }
`;

function CenteredLogo(props) {
    return (
        <div>
            <LogoWrap>
                <img src="images/logo.svg" alt=""/>
            </LogoWrap>
        </div>
    )
}

export default CenteredLogo;