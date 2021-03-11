import React, { useState, useEffect, useRef } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import BigInput from "./common/bigInput";
import ImageUploader from "./common/imageUploader";
import { Icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import TimePicker from "react-time-picker";
import { storage, firestore } from "../firebase.js";

import ScrollSection from "./common/scrollSection";
import SmallInput from "./common/smallInput";
import { useAuth } from "../contexts/AuthContext";
import Map from "./map";

const AddPotholes = () => {
  const {
    logout,
    currentUser,
    setCurrentUser,
    currentUserData,
    setCurrentUserData,
  } = useAuth();

  const [showCost, setShowCost] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 720); //720 is bootstrap md breakpoint
  const [startDate, setStartDate] = useState(new Date());
  const [selectedImages, setSelectedImages] = useState([]); //Image handler

  const sizeRef = useRef("Small");
  const locationRef = useRef("Here");
  const descriptionRef = useRef("");

  const updateMedia = () => {
    setDesktop(window.innerWidth > 720); //720 is bootstrap md breakpoint
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const handleShowCost = (e) => {
    e.preventDefault();
    setShowCost(!showCost);
  };

  const handleShowSchedule = (e) => {
    e.preventDefault();
    setShowSchedule(!showSchedule);
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      console.log(e.target.files);
      const imagesArray = Array.from(e.target.files);
      setSelectedImages(imagesArray);
    }
  };

  const handleImageDelete = (image) => {
    setSelectedImages(selectedImages.filter((pic) => pic !== image));
  };

  const renderImages = (images) => {
    if (images) {
      const imageDisplay = Array.from(images).map((image) =>
        URL.createObjectURL(image)
      );

      return imageDisplay.map((image, index) => {
        return (
          <span className="position-relative">
            <img
              src={image}
              key={image}
              height={75}
              width={75}
              className="border rounded m-2"
            />
            <span
              className="material-icons position-absolute top-0 end-0"
              style={{ colot: "white" }}
              onClick={() => handleImageDelete(selectedImages[index])}
              data-key={image}
            >
              cancel
            </span>
          </span>
        );
      });
    }
  };

  const handleImageUpload = () => {
    selectedImages.forEach((image) => {
      const uploadTask = storage.ref().child(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          // Handle unsuccessful uploads
          console.log("Error uploading image", image.name);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const imageArray = [];

    selectedImages.forEach((image, index, array) => {
      const uploadTask = storage.ref().child(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(`image uoloaded to storage successfully : ${image.name}`);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log("Error uploading image", image.name);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log("File available at", downloadURL);

            console.log(`${index} round photo ${image.name} URL is ready`);

            if (index === 0) imageArray.unshift(downloadURL);
            else imageArray.push(downloadURL);

            console.log(`imageArray is ${imageArray} at round ${index} `);

            if (imageArray.length === array.length) {
              const pothole = {
                userWhoAdded: currentUser.email,
                images: imageArray,
                size: sizeRef.current.value,
                location: locationRef.current.value,
                description: descriptionRef.current.value,
              };

              firestore
                .collection("potholes")
                .add({
                  pothole,
                })
                .then((docRef) => {
                  console.log("Pothole written with ID: ", docRef.id);
                })
                .catch((error) => {
                  console.error("Error adding pothole: ", error);
                });

              console.log(`submit working`, pothole);
            }
          });
        }
      );
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const imageFileNames = Array.from(selectedImages).map(
  //     (image) => image.name
  //   );

  //   const pothole = {
  //     userWhoAdded: currentUser.email,
  //     images: imageFileNames,
  //     size: sizeRef.current.value,
  //     location: locationRef.current.value,
  //     description: descriptionRef.current.value,
  //   };

  //   firestore
  //     .collection("potholes")
  //     .add({
  //       pothole,
  //     })
  //     .then((docRef) => {
  //       console.log("Pothole written with ID: ", docRef.id);
  //     })
  //     .catch((error) => {
  //       console.error("Error adding pothole: ", error);
  //     });

  //   console.log(`submit working`, pothole);
  // };

  return (
    <ScrollSection heading1={"Report A Pothole"} heading2={"Pothole #1375"}>
      <Form>
        {/* <ImageUploader /> */}
        <FormGroup>
          <span>{renderImages(selectedImages)}</span>
          <Input
            className="border rounded py-2 px-2"
            type={"file"}
            name={"imageUploader"}
            id="exampleName"
            placeholder={"Upload Images Here"}
            multiple
            onChange={handleImageChange}
          />
          <span onClick={handleImageUpload}>Upload</span>
          {console.log(selectedImages)}
        </FormGroup>
        <FormGroup>
          <Input innerRef={sizeRef} type="select" name="size">
            <option>Small</option>
            <option>Medium</option>
            <option>Big</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Input
            innerRef={locationRef}
            type="text"
            name="location"
            placeholder="Location"
          ></Input>
        </FormGroup>
        <FormGroup>
          <Input
            innerRef={descriptionRef}
            type={"text"}
            name={"description"}
            placeholder={"Description"}
          ></Input>
        </FormGroup>

        {/* <SmallInput
          innerRef={locationRef}
          type={"text"}
          name={"location"}
          placeholder="Location"
        /> */}
        {!isDesktop && <Map id="scroll-map"></Map>}
        {/* <BigInput
          innerRef={descriptionRef}
          type={"text"}
          name={"description"}
          placeholder={"Description"}
        /> */}

        {showCost && (
          <React.Fragment>
            <h5>Cost</h5>
            <SmallInput
              type={"number"}
              name={"cost"}
              placeholder={"Estimated cost to repair"}
            />
            <BigInput
              type={"text"}
              name={"materials"}
              placeholder={"Estimated materials required to repair"}
            />
            <FormGroup>
              <Input
                type="select"
                name="priority"
                placeholder="Urgency to repair - 1-5"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Input>
            </FormGroup>
          </React.Fragment>
        )}

        {showSchedule && (
          <React.Fragment>
            <h5>Schedule</h5>
            {/* <SmallInput
              type={"date"}
              name={"date"}
              placeholder={"Schedule a date for reapir"}
            /> */}
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText={"Select a repairs date"}
              dateFormat="d, MMMM, yyyy"
            />
            <TimePicker />
            <TimePicker />
            {/* <SmallInput
              type={"time"}
              name={"starttime"}
              placeholder={"Start time"}
            />
            <SmallInput
              type={"time"}
              name={"endtime"}
              placeholder={"End time"}
            /> */}
            <SmallInput
              type={"text"}
              name={"scheduledpersons"}
              placeholder={"Add persons to this job"}
            />
            <BigInput
              type={"text"}
              name={"personsadded"}
              placeholder={"Persons Added"}
            />
          </React.Fragment>
        )}

        <div className="d-f1lex justify-content-between">
          {currentUserData &&
            (currentUserData.role == "analyst" ||
              currentUserData.role == "manager") && (
              <Button color="primary" outline onClick={handleShowCost}>
                {showCost ? "Remove Cost" : "Add Cost"}
              </Button>
            )}
          {currentUserData && currentUserData.role === "manager" && (
            <Button color="primary" outline onClick={handleShowSchedule}>
              {showSchedule ? "Remove Schedule" : "Add Schedule"}
            </Button>
          )}
          <Button type="submit" onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </div>
      </Form>
    </ScrollSection>
  );
};

export default AddPotholes;
