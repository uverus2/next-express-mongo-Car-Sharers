import { useLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet-routing-machine";


function Routing(props) {
    const {from, to} = props;
    // Grabs the current leaflet map
    // Context Hook which allows certain Leaflet features to be amended
    const { map } = useLeaflet();

    // Use effect to render before page is loaded
    useEffect(() => {
        L.Routing.control({
            waypoints: [
                L.latLng(from),
                L.latLng(to)
            ],
            collapsible: true,
            show: false,
            draggable: false,
            showAlternatives: true,
            lineOptions: {
                styles: [{ color: '#034732', opacity: 1, weight: 7 }]
            },
            altLineOptions: {
                styles: [{ color: '#137547', opacity: 0.7, weight: 6 }]
            },
            createMarker: function (i, waypoint, number) {
                let marker_icon = null;
                if (i == 0) {
                    // This is the first marker, indicating start
                    marker_icon = L.icon({
                        iconUrl: 'images/start.png',
                        iconSize: [64, 64],
                        iconAnchor: [10, 60],
                      });
                } else if (i == number -1) {
                    //This is the last marker indicating destination
                    marker_icon = L.icon({
                        iconUrl: 'images/finish.png',
                        iconSize: [64, 64],
                        iconAnchor: [10, 64],
                      });
                }
                const marker = L.marker(waypoint.latLng, {
                  draggable: false,
                  bounceOnAdd: false,
                  bounceOnAddOptions: {
                    duration: 1000,
                    height: 800,
                    function() {
                      (bindPopup(myPopup).openOn(map))
                    }
                  },
                  icon: marker_icon
                });
                return marker;
              },
              router: L.Routing.mapbox('pk.eyJ1IjoidXZlcnVzIiwiYSI6ImNrNjd6ZHY5cDF2cGEzdHF3YmZqbDF6MnQifQ.NzYmc-5WtvMaYJUL_wFsNQ'),
        }).addTo(map);
    },[]);

    return null;
};

export default Routing

