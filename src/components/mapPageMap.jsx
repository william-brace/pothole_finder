import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { firestore } from "../firebase.js";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  "pk.eyJ1Ijoia2lsbGF3aWwiLCJhIjoiY2ttNHdteTZ6MDhteDJ2bzV6N3J6dmhsbCJ9.WJ75_MdchNdUTCSzdODKHg";

const MapPageMap = ({
  lat = 13.1939,
  lng = -59.5432,
  zoom = 10,
  mapClass = "map-full-page",
  updateLat,
  updateLng,
  displayOnly = false,
}) => {
  const mapContainer = useRef();
  // const [lng, setLng] = useState(-59.5432);
  // const [lat, setLat] = useState(13.1939);
  // const [zoom, setZoom] = useState(10);
  const potholeArray = [];
  const [displayPotholes, setDisplayPotholes] = useState(null);

  const renderPotholes = () => {
    //loop through pothole state and render all from there
  };

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

    map.on("click", (e) => {
      fetch(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          e.lngLat.lng +
          "," +
          e.lngLat.lat +
          ".json?types=region&access_token=" +
          "pk.eyJ1Ijoia2lsbGF3aWwiLCJhIjoiY2ttNHdteTZ6MDhteDJ2bzV6N3J6dmhsbCJ9.WJ75_MdchNdUTCSzdODKHg"
      )
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          console.log(myJson.features[0].place_name.split(",")[0]);
        })
        .catch((e) => {
          console.log(e);
        });
    });

    // map.on("click", function (e) {
    //   $.get(
    //     "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    //       e.lngLat.lng +
    //       "," +
    //       e.lngLat.lat +
    //       ".json?access_token=" +
    //       api_key,
    //     function (data) {
    //       console.log(data);
    //     }
    //   ).fail(function (jqXHR, textStatus, errorThrown) {
    //     alert("There was an error while geocoding: " + errorThrown);
    //   });
    //});

    firestore
      .collection("potholes")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((pothole) => {
          console.log(`raw potholes  `, pothole);
          console.log(pothole.id, " => ", pothole.data().pothole);

          const potholeData = { ...pothole.data().pothole, id: pothole.id };
          console.log(`pothole data for specific pothole is`, potholeData);
          potholeArray.push(potholeData);
          console.log(pothole.data().pothole.size);
        });
      })
      .then(() => {
        setDisplayPotholes(potholeArray);

        potholeArray.forEach((pothole) => {
          var marker = new mapboxgl.Marker()
            .setLngLat([pothole.location.lng, pothole.location.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                  "<h3>" +
                    pothole.name +
                    "</h3><p>" +
                    pothole.description +
                    "</p><a href='/viewapothole/" +
                    pothole.id +
                    "'>View</a>"
                )
            )
            .addTo(map);
        });
      })
      .catch((error) => {
        console.log("Error getting potholes: ", error);
      });

    // marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
    // updateLat(e.lngLat.lat);
    // updateLng(e.lngLat.lng);
    // lat = e.lngLat.lat;
    // lng = e.lngLat.lng;

    return () => map.remove();
  }, []);

  return (
    <div>
      <div className={mapClass} ref={mapContainer} />
    </div>
  );
};

export default MapPageMap;
