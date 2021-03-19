import React, { useEffect, useState } from "react";
import { storage, firestore } from "../firebase.js";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Input,
  InputGroupAddon,
  InputGroup,
} from "reactstrap";
import PaginationRender from "./common/paginationRender.jsx";
import { paginate } from "../utils/paginate.js";
import FilterGroup from "./filterGroup.jsx";
import SearchGroup from "./common/searchGroup";

const ViewPotholes = () => {
  const [potholes, setPotholes] = useState(null);
  const [potholeImages, setPotholeImages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const storageRef = storage.ref();
  const imagesRef = storageRef.child("images");
  const potholeArray = [];
  const [pagedPotholes, setPagedPotholes] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(null);
  const [potholeNumber, setPotholeNumber] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedIndex, setCheckedIndex] = useState(0);

  useEffect(() => {
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
        setPotholes(potholeArray);
        setPotholeNumber(potholeArray.length);
      })
      .catch((error) => {
        console.log("Error getting potholes: ", error);
      });
  }, []);

  //Dealing with searching and filtering the potholes before paginating and display
  useEffect(() => {
    if (potholes) {
      let filtered = potholes;

      if (searchQuery) {
        filtered = potholes.filter((pothole) =>
          pothole.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        console.log("filtered issss ", filtered);
        setPotholeNumber(filtered.length);
        setPagedPotholes(paginate(filtered, currentPage, 4));
      } else {
        if (selectedFilters === null || selectedFilters === "All") {
          setPagedPotholes(paginate(potholes, currentPage, 4));
          setPotholeNumber(potholes.length);
        } else {
          filtered = potholes.filter(
            (pothole) => pothole.size === selectedFilters
          );

          potholes.forEach((pothole) => {
            console.log("pothole size is ", pothole.size);
          });

          setPotholeNumber(filtered.length);
          setPagedPotholes(paginate(filtered, currentPage, 4));
        }
      }
    }
  }, [potholes, currentPage, selectedFilters, searchQuery]);

  const renderPotholes = (potholes) => {
    console.log(potholes);
    if (potholes) {
      return potholes.map((pothole) => {
        // pothole.image = URL.createObjectURL(pothole.image);
        return (
          <Card>
            <CardImg src={pothole.images[0]} alt={pothole.description} />
            <CardBody>
              <CardTitle tag="h5">{pothole.name}</CardTitle>
              <div className="d-flex justify-content-start">
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                  {pothole.size}
                </CardSubtitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted ml-4">
                  25 Fix it's!
                </CardSubtitle>
              </div>

              {/* <CardText></CardText> */}
              <div className="d-flex justify-content-between mt-2">
                <Button color="primary" outline className="pl-4 pr-4 ">
                  Fix it!
                </Button>
                <Button color="primary" className="pl-1 pr-1">
                  <Link
                    to={`/viewapothole/${pothole.id}`}
                    style={{ color: "white" }}
                  >
                    View
                  </Link>
                </Button>
              </div>
            </CardBody>
          </Card>
        );
      });
    }
  };

  const handlePageChange = (page) => {
    console.log(page);
    setCurrentPage(page);
  };

  const handleSearch = (query) => {
    console.log(query);
    setSelectedFilters("All");
    setCheckedIndex(0);
    setSearchQuery(query);
  };

  const handleRadioChange = (filter, index) => {
    setCurrentPage(1);
    setSearchQuery("");
    setSelectedFilters(filter);
    setCheckedIndex(index);
  };

  return (
    <React.Fragment>
      <div className="d-flex justify-content-center bg-light">
        <SearchGroup onSearch={handleSearch} value={searchQuery}></SearchGroup>
      </div>
      <div className="d-flex justify-content-center">
        {potholes && (
          <div>
            <h2>Filters</h2>
            <FilterGroup
              filters={["All", "Small", "Medium", "Big"]}
              filtersName={"Size"}
              selectedIndex={checkedIndex}
              onRadioChange={handleRadioChange}
            ></FilterGroup>
          </div>
        )}
        <div>
          <div className="d-flex justify-content-center">
            {potholeNumber && (
              <h6 className="mt-4">Showing {potholeNumber} potholes</h6>
            )}
          </div>
          <div className="flex-container">
            {pagedPotholes && renderPotholes(pagedPotholes)}
          </div>
          <div className="d-flex justify-content-center">
            {potholes && (
              <PaginationRender
                itemsCount={potholeNumber}
                pageSize={4}
                onPageChange={handlePageChange}
                currentPage={currentPage}
              >
                {console.log(potholes.length)}
              </PaginationRender>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ViewPotholes;
