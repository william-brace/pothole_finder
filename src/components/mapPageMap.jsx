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
  displayPotholes,
  setDisplayPotholes,
  potholeList,
  setPotholeList,
  markers,
}) => {
  const mapContainer = useRef();
  let map = useRef();

  const potholeArray = [];
  let potholeArrayParishes = [];

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      maxBounds: [
        [-59.9832008375472, 12.978538993452617],
        [-59.141592881512864, 13.390124403622153],
      ],
    });

    console.log(`map is defined`);

    return firestore
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
        console.log("first");
      })

      .then((data) => {
        let urls = [];
        console.log("second");
        potholeArray.forEach((pothole) => {
          urls.push(
            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
              pothole.location.lng +
              "," +
              pothole.location.lat +
              ".json?types=region&access_token=" +
              "pk.eyJ1Ijoia2lsbGF3aWwiLCJhIjoiY2ttNHdteTZ6MDhteDJ2bzV6N3J6dmhsbCJ9.WJ75_MdchNdUTCSzdODKHg"
          );
        });

        console.log("third");

        return Promise.all(
          urls.map((url, index) =>
            fetch(url)
              .then((response) => {
                return response.json();
              })
              .then((myJson) => {
                console.log(myJson.features[0].place_name.split(",")[0]);
                potholeArrayParishes.push({
                  ...potholeArray[index],
                  parish: myJson.features[0].place_name.split(",")[0],
                });
                console.log("Inside api fetch ", index);
              })
              .catch((e) => console.log(e))
          )
        );
      })
      .then(() => {
        console.log("potholeArrayParishes", potholeArrayParishes);
        console.log("fifth");
        setDisplayPotholes(potholeArrayParishes);
        setPotholeList(potholeArrayParishes);
      })
      .catch((error) => {
        console.log("Error getting potholes: ", error);
      });

    // marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
    // updateLat(e.lngLat.lat);
    // updateLng(e.lngLat.lng);
    // lat = e.lngLat.lat;
    // lng = e.lngLat.lng;

    //return () => map.remove();
  }, []);

  useEffect(() => {
    // map = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: "mapbox://styles/mapbox/streets-v11",
    //   center: [lng, lat],
    //   zoom: zoom,
    //   maxBounds: [
    //     [-59.9832008375472, 12.978538993452617],
    //     [-59.141592881512864, 13.390124403622153],
    //   ],
    // });
    console.log(`display potholes in render is`, displayPotholes);
    console.log(`map inside useEffect is`, map);
    if (map.current) {
      if (displayPotholes) {
        console.log(`display potholes in render is`, displayPotholes);
        displayPotholes.forEach((pothole) => {
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
                    "'>View</a>" +
                    "<p>" +
                    pothole.parish +
                    "</p>"
                )
            )
            .addTo(map.current);

          markers.current.push(marker);
        });
      }
    }
  }, [displayPotholes]);

  return (
    <div>
      <div className={mapClass} ref={mapContainer} />
    </div>
  );
};

export default MapPageMap;
