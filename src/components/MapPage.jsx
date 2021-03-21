import { popup } from "leaflet";
import React, { useState, useEffect, useRef } from "react";
import FilterModal from "./filterModal";
import MapPageMap from "./mapPageMap";

const MapPage = () => {
  const [sizeFilter, setSizeFilter] = useState(null);
  const [parishesFilter, setParishesFilter] = useState(null);

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
      let filtered = potholeList;
      if (sizeFilter) {
        if (sizeFilter != "All") {
          filtered = potholes.filter((pothole) => pothole.size === sizeFilter);
          console.log("filtered list is", filtered);
        }
      }
      if (parishesFilter) {
        if (parishesFilter != "All") {
          filtered = potholes.filter(
            (pothole) => pothole.parish === parishesFilter
          );
          console.log("filtered list is", filtered);
        }
      }

      setDisplayPotholes(filtered);

      //   if (parishesFilter) {
      //       if (parishesFilter != "")
      //   }
    }
    // let filtered = potholes.filter((pothole) => pothole.size === sizeFilter);
  }, [sizeFilter, potholeList, parishesFilter]);

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
        setParishesFilter={setParishesFilter}
      ></FilterModal>
    </React.Fragment>
  );
};

export default MapPage;
