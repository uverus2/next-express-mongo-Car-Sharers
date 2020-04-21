import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle `

    @font-face {
        font-family: Quicksand;
        src: url(fonts/Quicksand-VariableFont_wght.ttf);
    }

    html{
        font-size:62.5%;
        color: ${({theme}) => theme.colors.main};
    }

    body{
        overflow-x:hidden;
        overflow-y:scroll;
        ${({theme}) => theme.font.regular};
    }

    h1,h2,h3,h4,h5,h6{
        padding:1rem 0;
    }

    hr{
          
         width:100%;
         border-bottom:none;
    }

    h1{
        font-size: 4.2rem;
        ${({theme}) => theme.font.main};
        color: ${({theme}) => theme.colors.dark};
    }

    h2{
        font-size: 3.2rem;
        ${({theme}) => theme.font.main};
    }

    
    h3{
        font-size: 2.2rem;
        ${({theme}) => theme.font.medium};
    }

    h4{
        font-size: 1.8rem;
        ${({theme}) => theme.font.medium};
    }

    h5{
        font-size: 1.5rem;
        ${({theme}) => theme.font.light};
    }

    p{
        font-size: 1.5rem;
        ${({theme}) => theme.font.regular};
        padding:0.5rem;
    }

    a {
        font-size: 1.5rem;
        ${({theme}) => theme.font.medium};
        color: ${({theme}) => theme.colors.dark};
        text-decoration:none;
    }

    ul li, li a {
        color:${({theme}) => theme.colors.dark};
        font-size:2rem;
        padding:0.5rem 0;
        ${({theme}) => theme.font.main};
    }

    a:hover {
        color: ${({theme}) => theme.colors.main};
        text-decoration:underline;
        ${({theme}) => theme.font.main};
    }

    label{
        font-size: 1.3rem;
        text-align:left;
        margin:0.5rem 0;
        color: ${({theme}) => theme.colors.dark};
        ${({theme}) => theme.font.main};
    }
    input,.rw-multiselect>.rw-widget-picker, select, textarea{
        margin:0.5rem 0;
        border:solid 1px ${({theme}) => theme.colors.main};
        border-radius:6px;
        height:45px;
        padding:0.5rem;
        box-sizing: border-box;
        background:#ffffff;
    }

    textarea{
        height:100%;
    }

    rw-multiselect input, input, select, option, textarea{
        color: ${({theme}) => theme.colors.main};
        font-size:1.3rem;
        ${({theme}) => theme.font.regular};
    }

    rw-multiselect input{
        font-size:1.3rem;
        font-weight:400;
        height:100%;
        max-height: 30px;
        color: ${({theme}) => theme.colors.main};
    }

    select{
        appearance:none;
        color: ${({theme}) => theme.colors.dark};
    }

    select:focus, select:active {
        border-color: ${({theme}) => theme.colors.main};
        outline: 0;
        padding:0.5rem;
    }

    .rw-multiselect-tag{
        background:${({theme}) => theme.colors.dark};
        color:${({theme}) => theme.colors.light};
        vertical-align:middle;
        padding: 0.8rem;
        border-radius:25px;
    }

    .rw-popup{
        border:solid 1px ${({theme}) => theme.colors.main};
        border-radius:6px;
        padding:5px;
        font-size:1.5rem;
        color:${({theme}) => theme.colors.dark};
    }

    .rw-list-option:hover, .rw-list-option:hover.rw-state-focus {
        background:${({theme}) => theme.colors.dark};
        color:${({theme}) => theme.colors.light};
    }

    .rw-popup ul li {
        color:${({theme}) => theme.colors.dark}; 
    }

    .rw-list-option.rw-state-focus{
        border-color:none;
        border:none;
        color:${({theme}) => theme.colors.dark};
    }

    .rw-state-focus>.rw-widget-container, .rw-state-focus>.rw-widget-container:hover{
        border:solid 1px ${({theme}) => theme.colors.main};
        box-shadow:none;
    }

    input:active, input:focus, fw-open:focus, fw-open:active, rw-multiselect>.rw-widget-picker:focus,.rw-multiselect>.rw-widget-picker:active, rw-popup-container:active, rw-popup-container:focus {
        outline:none;
    }

    .hide{
        display:none;
    }

    .capitalLetter{
        text-transform: capitalize;
    }

    .uppercaseLetter{
        text-transform: uppercase;
    }

    .leaflet-container {
        width: 100%;
        height: 60vh;
    }

    .leaflet-routing-container {
        background:${({theme}) => theme.colors.secondary};
        color:${({theme}) => theme.colors.light};
        border-radius: 15px;
    }

    .leaflet-routing-alt tr:hover {
        background-color: ${({theme}) => theme.colors.light};
        color:${({theme}) => theme.colors.dark};
    }

    .leaflet-routing-collapse-btn:after {
        padding: 1.2rem 1.2rem 1rem 0;
        display: block;
    }
    
    .leaflet-routing-icon{
        background-image: url(images/leaflet.routing.icons.png);
    }

    .leaflet-routing-container-hide .leaflet-routing-collapse-btn{
        background-image:url('images/routing-icon.png');
        top: 2px;
    }

    .leaflet-bar a, .leaflet-bar a:hover{
        color:${({theme}) => theme.colors.dark};
        background-color:${({theme}) => theme.colors.secondary}; 
    }

    .leaflet-bar a:hover{
        background-color:${({theme}) => theme.colors.light};
    }

`;


export default GlobalStyles;