import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "reactstrap";

import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  "pk.eyJ1Ijoia2lsbGF3aWwiLCJhIjoiY2ttNHdteTZ6MDhteDJ2bzV6N3J6dmhsbCJ9.WJ75_MdchNdUTCSzdODKHg";

const MapBox = ({
  lat = 13.1939,
  lng = -59.5432,
  zoom = 10,
  mapClass = "map-full-page",
  updateLat,
  updateLng,
  setParish,
  displayOnly = false,
}) => {
  const mapContainer = useRef();
  const [currentLocationLat, setCurrentLocationLat] = useState(null);
  const [currentLocationLng, setCurrentLocationLng] = useState(null);
  // const [lng, setLng] = useState(-59.5432);
  // const [lat, setLat] = useState(13.1939);
  // const [zoom, setZoom] = useState(10);

  fetch(
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      lng +
      "," +
      lat +
      ".json?types=region&access_token=" +
      "pk.eyJ1Ijoia2lsbGF3aWwiLCJhIjoiY2ttNHdteTZ6MDhteDJ2bzV6N3J6dmhsbCJ9.WJ75_MdchNdUTCSzdODKHg"
  )
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      console.log(myJson.features[0].place_name.split(",")[0]);
      setParish(myJson.features[0].place_name.split(",")[0]);
    })
    .catch((e) => {
      console.log(e);
    });

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      maxBounds: [
        [-59.9832008375472, 12.978538993452617],
        [-59.141592881512864, 13.390124403622153],
      ],
    });

    if (!displayOnly) {
      navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
        enableHighAccuracy: true,
      });

      function successLocation(position) {
        console.log([position.coords.longitude, position.coords.latitude]);

        if (updateLat && updateLng) {
          updateLat(position.coords.latitude);
          updateLng(position.coords.longitude);
        }
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        map.flyTo({
          center: [lng, lat],
          zoom: 16,
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        });

        var marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map); // add the marker to the map

        map.on("click", function (e) {
          // The event object (e) contains information like the
          // coordinates of the point on the map that was clicked.
          console.log("A click event has occurred at " + e.lngLat);

          marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
          updateLat(e.lngLat.lat);
          updateLng(e.lngLat.lng);
          lat = e.lngLat.lat;
          lng = e.lngLat.lng;
        });
      }
      function errorLocation() {
        console.log([-2.24, 53.48]);
      }

      return () => map.remove();
    }

    if (displayOnly) {
      var marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

      navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
        enableHighAccuracy: true,
      });

      function successLocation(position) {
        console.log([position.coords.longitude, position.coords.latitude]);
        setCurrentLocationLat(position.coords.latitude);
        setCurrentLocationLng(position.coords.longitude);
      }
      function errorLocation() {
        console.log([-2.24, 53.48]);
      }
    }
  }, []);

  return (
    <div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      {displayOnly && currentLocationLat && currentLocationLng && lat && lng && (
        <Button color="primary" className="googleMapsButton">
          <a
            style={{ color: "white" }}
            href={`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${setCurrentLocationLat},${setCurrentLocationLng}`}
            target="_blank"
          >
            Get Directions in Google Maps
          </a>
        </Button>
      )}
      <div className={mapClass} ref={mapContainer}></div>
    </div>
  );
};

export default MapBox;
