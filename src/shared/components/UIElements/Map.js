//useRef can create variable that can survive the render cycle
//useEffect is a hook that runs after the component is rendered
import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
    const mapRef = useRef();

    const { center, zoom } = props;

    //array of dependencies, when dependency changes, the function will run again
    //if no dependency included, the function will run only once when mounted
    useEffect(() => {
        //this is the map constructor which becomes 
        //available after adition of the map api in index.html
        const map = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom
        });

        new window.google.maps.Marker({
            position: center,
            map: map
        });
    },
        [center, zoom]
    );



    return (
        <div
            ref={mapRef}
            className={`map ${props.className}`}
            style={props.style}
        >

        </div>
    );
};

export default Map;