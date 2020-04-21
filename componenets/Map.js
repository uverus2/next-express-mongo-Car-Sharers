import React, {useState, useEffect, useRef} from "react";
import { Map, Marker, Popup, TileLayer, useLeaflet } from "react-leaflet";
import L from "leaflet";
import styled from "styled-components";
import Routing from "./Routing";

const Button = styled.button`
    padding:2.2rem;
    color:${({theme}) => theme.colors.light};
    background:${({theme}) => theme.colors.dark};
    border:solid 2px ${({theme}) => theme.colors.dark};
    border-radius: 10rem;
    font-weight:bold;
    max-width:20rem;
    width:100%;
    margin-top:1rem;
    
    :active, :focus{
        outline:none;
    }
    :hover{
        color:${({theme}) => theme.colors.dark};
        background:${({theme}) => theme.colors.light};
    }
`;

function MapLeaflet(props) {
    const {locationFrom, locationTo} = props;
    const [userCoordinates, setUserCoordinates] = useState([]);
    const refMap = useRef();
    const iconPerson = new L.Icon({
        iconUrl: "images/target.png",
        iconAnchor: null,
        popupAnchor: [0,0],
        shadowAnchor: null,
        iconSize: [64, 64]
    });

    const myLocation = () => {
        console.log(refMap.current.leafletElement)
        refMap.current.leafletElement.flyTo(userCoordinates,12);
    };

    useEffect(() => {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition (
                    gpspos=> {
                        setUserCoordinates([gpspos.coords.latitude, gpspos.coords.longitude]);
                    },
                    err => {
                        console.log(err);
                        setUserCoordinates([]);
                    }
                );
            }
            else{
                setUserCoordinates([]);
                alert("Sorry, geolocation not supported in this browser");
            }
    }, []);

  return (
    <>
    {locationFrom.length > 0 && locationTo.length > 0  && (
        <>
        <Map ref={refMap} center={[locationFrom[0], locationFrom[1]]}  zoom={12}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
            <TileLayer url="https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=qGdIpAKigXZEv2P7IzXL0CENAYAoADsX&thickness=5"/>
            <TileLayer url="https://api.tomtom.com/traffic/map/4/tile/incidents/s1/{z}/{x}/{y}.png?key=qGdIpAKigXZEv2P7IzXL0CENAYAoADsX&thickness=5"/>
            <Routing from={locationFrom} to={locationTo}/>
            {userCoordinates.length > 0 && (<Marker position={userCoordinates} icon={iconPerson}>
                <Popup>
                   Your Location
                </Popup>
            </Marker>
            )}
        </Map>
        {userCoordinates.length > 0 && (<Button onClick={myLocation}> My Location </Button>)}
        </>
    )}
    </>
  );
}

export default MapLeaflet