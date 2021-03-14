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
} from "reactstrap";

const ViewPotholes = () => {
  const [potholes, setPotholes] = useState(null);
  const [potholeImages, setPotholeImages] = useState(null);
  const storageRef = storage.ref();
  const imagesRef = storageRef.child("images");
  const potholeArray = [];

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
      })
      .catch((error) => {
        console.log("Error getting potholes: ", error);
      });
  }, []);

  const renderPotholes = (potholes) => {
    console.log(potholes);
    if (potholes) {
      return potholes.map((pothole) => {
        // pothole.image = URL.createObjectURL(pothole.image);
        return (
          <Card>
            <CardImg
              top
              width="30%"
              src={pothole.images[0]}
              alt={pothole.description}
            />
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
                <Button color="primary" className="pl-4 pr-4">
                  <Link to={`/viewapothole/${pothole.id}`}>View</Link>
                </Button>
              </div>
            </CardBody>
          </Card>
        );
      });
    }
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

  return (
    <React.Fragment>
      {/* {getPotholeImages(potholes)}
      {console.log(potholeArray)}
      {renderImages(potholeImages)} */}

      <div className="container" id="no-margin-padding">
        <div className="row">{potholes && renderPotholes(potholes)}</div>
      </div>
    </React.Fragment>
  );
};

export default ViewPotholes;
