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

  useEffect(() => {
    if (potholes) {
      if (selectedFilters === null || selectedFilters === "All") {
        setPagedPotholes(paginate(potholes, currentPage, 4));
        setPotholeNumber(potholes.length);
      } else {
        const filtered = potholes.filter(
          (pothole) => pothole.size === selectedFilters
        );

        potholes.forEach((pothole) => {
          console.log("pothole size is ", pothole.size);
        });

        setPotholeNumber(filtered.length);
        setPagedPotholes(paginate(filtered, currentPage, 4));
      }
    }
  }, [potholes, currentPage, selectedFilters]);

  const renderPotholes = (potholes) => {
    console.log(potholes);
    if (potholes) {
      return potholes.map((pothole) => {
        // pothole.image = URL.createObjectURL(pothole.image);
        return (
          <Card>
            <CardImg src={pothole.images[0]} alt={pothole.description} />
            <CardBody>
              <CardTitle tag="h4">{pothole.size}</CardTitle>
              <div className="d-flex justify-content-start">
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                  $135
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

  // const getPotholeImages = (potholes) => {
  //   if (potholes) {
  //     return potholes.forEach((pothole, index) => {
  //       storageRef
  //         .child(`images/${pothole.images[0]}`)
  //         .getDownloadURL()
  //         .then((url) => {
  //           potholeArray.push(url);
  //         })
  //         .then(() => {
  //           setPotholeImages(potholeArray);
  //         })
  //         .catch((e) => {
  //           console.log(`eror getting pothole images ${e}`);
  //         });
  //     });
  //   }
  // };

  // const renderImages = (potholeImages) => {
  //   return potholeArray.map((image) => {
  //     return (
  //       <Card className="col">
  //         <CardImg top width="30%" src={image} alt={"helo"} />
  //         <CardBody>
  //           <CardTitle tag="h5">Card title</CardTitle>
  //           <CardSubtitle tag="h6" className="mb-2 text-muted">
  //             Card subtitle
  //           </CardSubtitle>
  //           <CardText>
  //             Some quick example text to build on the card title and make up the
  //             bulk of the card's content.
  //           </CardText>
  //           <Button>Button</Button>
  //         </CardBody>
  //       </Card>
  //     );
  //   });
  // };

  const handleFilterSelect = (filter) => {
    setCurrentPage(1);
    setSelectedFilters(filter);
  };

  return (
    <React.Fragment>
      {/* {getPotholeImages(potholes)}
      {console.log(potholeArray)}
      {renderImages(potholeImages)} */}

      {/* <div className="container" id="no-margin-padding">
        <div className="row">{potholes && renderPotholes(potholes)}</div>
      </div> */}
      <div className="d-flex justify-content-center bg-light">
        <InputGroup size="lg" className="mt-2 mb-4 ml-4 mr-4 w-100 shadow-sm ">
          <Input placeholder="Name of pothole..." className="border-0"></Input>
          <InputGroupAddon addonType="append">
            <Button color="primary">Search</Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="d-flex justify-content-center">
        {potholes && (
          <div>
            <h2>Filters</h2>
            <FilterGroup
              filters={["All", "Small", "Medium", "Big"]}
              filtersName={"Size"}
              onFilterSelect={handleFilterSelect}
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
