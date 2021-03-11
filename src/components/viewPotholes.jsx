import React, { useEffect, useState } from "react";
import { storage, firestore } from "../firebase.js";
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
          console.log(pothole.id, " => ", pothole.data().pothole);
          potholeArray.push(pothole.data().pothole);
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
      return potholes.map((pothole, index) => {
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
              <CardTitle tag="h5">{pothole.description}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Card subtitle
              </CardSubtitle>
              <CardText>
                Some quick example text to build on the card title and make up
                the bulk of the card's content. {pothole.description}
                {pothole.images[0]}
              </CardText>
              <Button>Button</Button>
            </CardBody>
          </Card>
        );
      });
    }
  };

  const getPotholeImages = (potholes) => {
    if (potholes) {
      return potholes.forEach((pothole, index) => {
        storageRef
          .child(`images/${pothole.images[0]}`)
          .getDownloadURL()
          .then((url) => {
            potholeArray.push(url);
          })
          .then(() => {
            setPotholeImages(potholeArray);
          })
          .catch((e) => {
            console.log(`eror getting pothole images ${e}`);
          });
      });
    }
  };

  const renderImages = (potholeImages) => {
    return potholeArray.map((image) => {
      return (
        <Card>
          <CardImg top width="30%" src={image} alt={"helo"} />
          <CardBody>
            <CardTitle tag="h5">Card title</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              Card subtitle
            </CardSubtitle>
            <CardText>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </CardText>
            <Button>Button</Button>
          </CardBody>
        </Card>
      );
    });
  };

  return (
    <React.Fragment>
      {/* {getPotholeImages(potholes)}
      {console.log(potholeArray)}
      {renderImages(potholeImages)} */}
      <div>{potholes && renderPotholes(potholes)}</div>
    </React.Fragment>
  );
};

export default ViewPotholes;
