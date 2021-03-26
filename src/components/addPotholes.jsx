import React, { useState, useEffect, useRef } from "react";
import { Button, Form, FormGroup, Input, Alert, CustomInput } from "reactstrap";
import DatePicker from "react-datepicker";
import BigInput from "./common/bigInput";
import ImageUploader from "./common/imageUploader";
import { Icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import TimePicker from "react-time-picker";
import { storage, firestore } from "../firebase.js";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Joi from "joi-browser";

import ScrollSection from "./common/scrollSection";
import SmallInput from "./common/smallInput";
import { useAuth } from "../contexts/AuthContext";
import Map from "./map";
import MapBox from "./mapBox";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const AddPotholes = () => {
  const {
    logout,
    currentUser,
    setCurrentUser,
    currentUserData,
    setCurrentUserData,
  } = useAuth();

  const animatedComponents = makeAnimated();

  //States of view
  const [showCost, setShowCost] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 720); //720 is bootstrap md breakpoint
  const [scheduleListUsers, setScheduleListUsers] = useState([]); //Used to display the users in the dropdown to pick persons to schedule to the job
  const [errors, setErrors] = useState();
  const [parish, setParish] = useState(null);

  //Input States
  const [selectedImages, setSelectedImages] = useState([]); //Image handler
  const [size, setSize] = useState("");
  const [lng, setLng] = useState(null); //Location divided into lng and lat
  const [lat, setLat] = useState(null);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(null);
  const [materials, setMaterials] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [potholeName, setPotholeName] = useState(null);

  const sizeRef = useRef(null);
  const locationRef = useRef(null);
  const descriptionRef = useRef(null);
  const costRef = useRef(null);
  const materialsRef = useRef(null);
  const priorityRef = useRef(null);
  const dateRef = useRef(null);
  const personsRef = useRef(null);

  const [zoom, setZoom] = useState(10);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 720); //720 is bootstrap md breakpoint
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    console.log(
      uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        length: 2,
      })
    );
    return () => window.removeEventListener("resize", updateMedia);
  });

  useEffect(() => {
    console.log("Hello");
  }, [showSchedule == true]);

  // useEffect(() => {
  //   let potholeArray;
  //   let potholeNamey;
  //   let repeat = true;

  //   while ((repeat = true)) {
  //     repeat = false;

  //     potholeNamey = uniqueNamesGenerator({
  //       dictionaries: [adjectives, colors, animals],
  //       length: 2,
  //     });

  //     firestore
  //       .collection("potholes")
  //       .get()
  //       .then((querySnapshot) => {
  //         querySnapshot.forEach((pothole) => {
  //           console.log(`raw potholes  `, pothole);
  //           console.log(pothole.id, " => ", pothole.data().pothole);

  //           const potholeData = { ...pothole.data().pothole, id: pothole.id };
  //           console.log(`pothole data for specific pothole is`, potholeData);
  //           potholeArray.push(potholeData);
  //           console.log(pothole.data().pothole.size);

  //           if (pothole.name === potholeNamey) repeat = true;
  //         });
  //       })
  //       .then(() => {})
  //       .catch((error) => {
  //         console.log("Error getting potholes: ", error);
  //       });
  //   }
  //   setPotholeName(potholeNamey);
  // }, []);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  //     enableHighAccuracy: true,
  //   });

  //   function successLocation(position) {
  //     console.log([position.coords.longitude, position.coords.latitude]);
  //     setLng(position.coords.longitude);
  //     setLat(position.coords.latitude);
  //   }

  //   function errorLocation() {
  //     console.log([-2.24, 53.48]);
  //   }
  // }, []);

  const schema1 = {
    images: Joi.array().required().min(1),
    size: Joi.string().required(),
    location: Joi.required(),
    description: Joi.string().required(),
  };

  const schema2 = {
    images: Joi.array().required().min(1),
    size: Joi.string().required(),
    location: Joi.required(),
    description: Joi.string().required(),
    cost: Joi.number().required(),
    materials: Joi.string().required(),
    priority: Joi.number().required(),
  };

  const schema3 = {
    images: Joi.array().required().min(1),
    size: Joi.string().required(),
    location: Joi.required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    personsAssigned: Joi.array().required().min(1),
  };

  const schema4 = {
    images: Joi.array().required().min(1),
    size: Joi.string().required(),
    location: Joi.required(),
    description: Joi.string().required(),
    cost: Joi.number().required(),
    materials: Joi.string().required(),
    priority: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    personsAssigned: Joi.array().required().min(1),
  };

  const validate = () => {
    console.log(`cost is  ${cost}`);

    let result;

    if (!showCost && !showSchedule) {
      result = Joi.validate(
        {
          images: selectedImages,
          size: size,
          location: { lng: lng, lat: lat },
          description: description,
        },
        schema1,
        { abortEarly: false }
      );
    }

    if (showCost && !showSchedule) {
      result = Joi.validate(
        {
          images: selectedImages,
          size: size,
          location: { lng: lng, lat: lat },
          description: description,
          cost: cost,
          materials: materials,
          priority: priority,
        },
        schema2,
        { abortEarly: false }
      );
    }

    if (!showCost && showSchedule) {
      result = Joi.validate(
        {
          images: selectedImages,
          size: size,
          location: { lng: lng, lat: lat },
          description: description,
          startDate: startDate,
          endDate: endDate,
          personsAssigned: selectedPersons,
        },
        schema3,
        { abortEarly: false }
      );
    }

    if (showCost && showSchedule) {
      result = Joi.validate(
        {
          images: selectedImages,
          size: size,
          location: { lng: lng, lat: lat },
          description: description,
          cost: cost,
          materials: materials,
          priority: priority,
          startDate: startDate,
          endDate: endDate,
          personsAssigned: selectedPersons,
        },
        schema4,
        { abortEarly: false }
      );
    }
    // const result = Joi.validate(
    //   {
    //     images: selectedImages,
    //     size: size,
    //     location: { lng: lng, lat: lat },
    //     description: description,
    //     cost: cost,
    //     materials: materials,
    //     priority: priority,
    //     startDate: startDate,
    //     endDate: endDate,
    //     personsAssigned: selectedPersons,
    //   },
    //   schema1
    // );

    // images: selectedImages,
    //     size: size,
    //     location: { lng: lng, lat: lat },
    //     description: description,
    //     cost: cost,
    //     materials: materials,
    //     priority: priority,
    //     startDate: startDate,
    //     endDate: endDate,
    //     personsAssigned: selectedPersons,
    console.log(result);

    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  useEffect(() => {
    if (showSchedule === true) {
      getScheduleUsers(showSchedule);
    }
  }, [showSchedule]);

  const handleShowCost = (e) => {
    e.preventDefault();
    setShowCost(!showCost);
  };

  const handleShowSchedule = (e) => {
    e.preventDefault();
    setShowSchedule(!showSchedule);
  };

  const getScheduleUsers = (showScheduleValue) => {
    const userArray = [];
    if (showScheduleValue === true) {
      firestore
        .collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((user) => {
            console.log(`email is`, user.data().email);
            const userData = {
              value: user.data().email,
              label: `${user.data().email} - ${user.data().role}`,
            };
            userArray.push(userData);
            console.log(userData);
          });
        })
        .then(() => {
          setScheduleListUsers(userArray);
        })
        .catch((error) => {
          console.log("Error getting schedule users: ", error);
        });
    }
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

    //Validate fields and return if they are errors
    // after setting state for errors which will then
    // be used to display with alerts in the form
    const results = validate();
    setErrors(results);
    console.log(results);
    if (results) return;

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
                name: uniqueNamesGenerator({
                  dictionaries: [adjectives, colors, animals],
                  length: 2,
                }),
                images: imageArray,
                size: size,
                location: { lng: lng, lat: lat },
                description: description,
                cost: cost,
                materials: materials,
                priority: priority,
                startDate: startDate,
                endDate: endDate,
                personsAssigned: selectedPersons,
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

  const handlePersonChange = (persons) => {
    const newPersons = persons.map((person) => {
      return person.value;
    });

    setSelectedPersons(newPersons);
  };

  return (
    <div className="container-fluid" id="no-padding">
      <div className="row">
        <ScrollSection
          className=" col-md-4"
          heading1={"Report A Pothole"}
          heading2={"Pothole #1375"}
        >
          <Form className="scroll-section-form">
            {/* <ImageUploader /> */}
            <FormGroup>
              {errors && errors.images && (
                <Alert color="danger">{errors.images}</Alert>
              )}
              {renderImages(selectedImages)}
              <CustomInput
                type="file"
                name="customFile"
                multiple
                onChange={handleImageChange}
              />
            </FormGroup>
            <FormGroup>
              {errors && errors.size && (
                <Alert color="danger">{errors.size}</Alert>
              )}
              <Input
                onChange={(e) => setSize(e.target.value)}
                type="select"
                name="size"
              >
                <option value="" disabled selected hidden>
                  Size
                </option>
                <option>Small</option>
                <option>Medium</option>
                <option>Big</option>
              </Input>
            </FormGroup>
            {!lat && !lng && (
              <FormGroup>
                <Input
                  innerRef={locationRef}
                  type="text"
                  name="location"
                  placeholder="Finding location..."
                  disabled
                ></Input>
              </FormGroup>
            )}

            {lat && lng && parish && (
              <FormGroup>
                <Input
                  innerRef={locationRef}
                  type="textarea"
                  name="location"
                  value={`Location: ${lat}, ${lng}\nParish: ${parish}`}
                  disabled
                  style={{ resize: "none" }}
                ></Input>
              </FormGroup>
            )}
            {errors && errors.description && (
              <Alert color="danger">{errors.description}</Alert>
            )}
            <FormGroup>
              <Input
                onChange={(e) => setDescription(e.target.value)}
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
            {!isDesktop && (
              <div style={{ position: "relative" }}>
                <MapBox
                  id="scroll-map"
                  lat={lat}
                  lng={lng}
                  zoom={zoom}
                  mapClass="map-scroll"
                  updateLat={setLat}
                  updateLng={setLng}
                  setParish={setParish}
                ></MapBox>
              </div>
            )}
            {/* <BigInput
          innerRef={descriptionRef}
          type={"text"}
          name={"description"}
          placeholder={"Description"}
        /> */}

            {showCost && (
              <React.Fragment>
                <h5>Cost</h5>
                <FormGroup>
                  {errors && errors.cost && (
                    <Alert color="danger">{errors.cost}</Alert>
                  )}

                  <Input
                    // innerRef={costRef}
                    type={"number"}
                    name={"cost"}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder={"Estimated cost to repair"}
                  ></Input>
                </FormGroup>
                <FormGroup>
                  {errors && errors.materials && (
                    <Alert color="danger">{errors.materials}</Alert>
                  )}
                  <Input
                    onChange={(e) => setMaterials(e.target.value)}
                    type={"text"}
                    name={"materials"}
                    placeholder={"Estimated materials required to repair"}
                  ></Input>
                </FormGroup>
                <FormGroup>
                  {errors && errors.priority && (
                    <Alert color="danger">{errors.priority}</Alert>
                  )}
                  <Input
                    type="select"
                    name="priority"
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="" disabled selected hidden>
                      Priority rating - 1-5
                    </option>
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
                {errors && errors.startDate && (
                  <Alert color="danger">{errors.startDate}</Alert>
                )}
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText={"Select a repairs start date"}
                  dateFormat="d, MMMM, yyyy h:mm aa"
                  showTimeInput
                />
                {errors && errors.endDate && (
                  <Alert color="danger">{errors.endDate}</Alert>
                )}
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText={"Select a repairs end date"}
                  dateFormat="d, MMMM, yyyy h:mm aa"
                  showTimeInput
                />
                {/* <TimePicker />
                <TimePicker /> */}
                {console.log(startDate)}
                {console.log(endDate)}
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
                {/* <SmallInput
                  type={"text"}
                  name={"scheduledpersons"}
                  placeholder={"Add persons to this job"}
                />
                <BigInput
                  type={"text"}
                  name={"personsadded"}
                  placeholder={"Persons Added"}
                /> */}
                {errors && errors.personsAssigned && (
                  <Alert color="danger">{errors.personsAssigned}</Alert>
                )}
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  defaultValue={"dog"}
                  isMulti
                  options={scheduleListUsers}
                  ref={personsRef}
                  onChange={handlePersonChange}
                  placeholder={"Select persons to assign to repair job..."}
                />
                {/* [
                    { value: "chocolate", label: "Chocolate" },
                    { value: "strawberry", label: "Strawberry" },
                    { value: "vanilla", label: "Vanilla" },
                  ] */}
                {console.log(selectedPersons)}
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
        {/* style={{ position: "relative" }} */}
        {isDesktop && (
          <div className="col-md-8">
            <MapBox
              // id="scroll-map"
              lat={lat}
              lng={lng}
              zoom={zoom}
              mapClass="map-half-page"
              updateLat={setLat}
              updateLng={setLng}
              setParish={setParish}
            ></MapBox>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPotholes;
