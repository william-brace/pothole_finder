import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { geolocated } from "react-geolocated";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

// function LocationMarker() {
//   const [position, setPosition] = useState(null);
//   // const map = useMapEvents({
//   //   when() {
//   //     map.locate();
//   //   },
//   //   locationfound(e) {
//   //     setPosition(e.latlng);
//   //     map.flyTo(e.latlng, map.getZoom());
//   //   },
//   // });

//   const map = useMapEvents(map.locate());

//   console.log();

//   return position === null ? null : (
//     <Marker position={position}>
//       <Popup>You are here</Popup>
//     </Marker>
//   );
// }

const Map = (props) => {
  // const [position, setPosition] = useState(null);
  // let place;

    const DEFAULT_LATITUDE = 13.1939;
    const DEFAULT_LONGITUDE = -59.5432;

  const latitude = props.coords ? props.coords.latitude : DEFAULT_LATITUDE;
  const longitude = props.coords ? props.coords.longitude : DEFAULT_LONGITUDE;

  // useEffect(() => {
  //   const getLocation = navigator.geolocation.getCurrentPosition(function (
  //     position
  //   ) {
  //     console.log("Latitude is :", position.coords.latitude);
  //     console.log("Longitude is :", position.coords.longitude);
  //     place = position.coords.latitude;

  //     //setPosition(position.coords.latitude);
  //   });

  //   return () => getLocation;
  // }, []);
  return (
    <MapContainer
      className="map-container"
      id={props.id}
      center={[latitude, longitude]}
      zoom={12}
      scrollWheelZoom={true}
      tap={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {latitude && (
        <Marker position={[latitude, longitude]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )}
      )
      {/* <LocationMarker /> */}
    </MapContainer>
  );
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Map);
