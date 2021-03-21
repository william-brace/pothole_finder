import { popup } from "leaflet";
import React, { useState, useEffect, useRef } from "react";
import FilterModal from "./filterModal";
import MapPageMap from "./mapPageMap";

const MapPage = () => {
  const [sizeFilter, setSizeFilter] = useState(null);
  const [displayPotholes, setDisplayPotholes] = useState();
  const [filteredPotholes, setFilteredPotholes] = useState();
  const [potholeList, setPotholeList] = useState(null);
  const markers = useRef([]);

  useEffect(() => {
    console.log("sizeFilter changed", sizeFilter);

    console.log("potholesList inside of mappage", potholeList);

    console.log("markers are", markers);

    if (potholeList) {
      console.log(potholeList);
      let potholes = potholeList;
      if (sizeFilter) {
        if (sizeFilter === "All") return setDisplayPotholes(potholes);

        let filtered = potholes.filter(
          (pothole) => pothole.size === sizeFilter
        );
        console.log("filtered list is", filtered);
        setDisplayPotholes(filtered);
        removeMarkers();
      }
    }
    // let filtered = potholes.filter((pothole) => pothole.size === sizeFilter);
  }, [sizeFilter, potholeList]);

  const removeMarkers = () => {
    markers.current.forEach((marker) => {
      marker.remove();
    });
  };

  return (
    <React.Fragment>
      <MapPageMap
        displayPotholes={displayPotholes}
        setDisplayPotholes={setDisplayPotholes}
        potholeList={potholeList}
        setPotholeList={setPotholeList}
        markers={markers}
      ></MapPageMap>
      <FilterModal
        className={"filterModal"}
        buttonLabel={"Add Filters"}
        setSizeFilter={setSizeFilter}
      ></FilterModal>
    </React.Fragment>
  );
};

export default MapPage;
