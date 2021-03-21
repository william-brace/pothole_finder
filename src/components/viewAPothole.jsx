import React, { useState, useEffect, useRef } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import BigInput from "./common/bigInput";
import TimePicker from "react-time-picker";
import ScrollSection from "./common/scrollSection";
import SmallInput from "./common/smallInput";
import { useAuth } from "../contexts/AuthContext";
import MapBox from "./mapBox";
import { storage, firestore } from "../firebase.js";

const ViewAPothole = ({ match }) => {
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
  const [parish, setParish] = useState(null);

  const sizeRef = useRef("Small");
  const locationRef = useRef("Here");
  const descriptionRef = useRef("");

  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [zoom, setZoom] = useState(10);

  const [pothole, setPothole] = useState({ size: "" });

  const updateMedia = () => {
    setDesktop(window.innerWidth > 720); //720 is bootstrap md breakpoint
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  useEffect(() => {
    console.log(`match params id = `, match.params.id);
    var docRef = firestore.collection("potholes").doc(match.params.id);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data().pothole);
          setPothole(doc.data().pothole);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);

  const renderImages = (images) => {
    if (images) {
      return images.map((image, index) => {
        return (
          <span className="position-relative">
            <img
              src={image}
              key={image}
              height={75}
              width={75}
              className="border rounded m-2"
            />
          </span>
        );
      });
    }
  };

  return (
    <div className="container-fluid" id="no-padding">
      <div className="row">
        <ScrollSection
          className="col-md-4"
          heading1={"Viewing A Pothole"}
          heading2={"Pothole #1375"}
        >
          {console.log(pothole)}
          {console.log(pothole.size)}
          <Button type="submit" color="primary">
            Edit
          </Button>
          <Form>
            <FormGroup>{renderImages(pothole.images)}</FormGroup>
            <FormGroup>
              <Input
                innerRef={sizeRef}
                type="text"
                name="size"
                value={pothole.size}
                disabled
              />
            </FormGroup>
            {!pothole.location && (
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

            {pothole.location && parish && (
              <FormGroup>
                <Input
                  innerRef={locationRef}
                  type="textarea"
                  name="location"
                  value={`Location: ${pothole.location.lat}, ${pothole.location.lng}\nParish: ${parish}`}
                  disabled
                  style={{ resize: "none" }}
                ></Input>
              </FormGroup>
            )}
            <FormGroup>
              <Input
                innerRef={descriptionRef}
                type={"textarea"}
                name={"description"}
                value={pothole.description}
                disabled
              ></Input>
            </FormGroup>

            {/* <SmallInput
          innerRef={locationRef}
          type={"text"}
          name={"location"}
          placeholder="Location"
        /> */}
            {!isDesktop && pothole.location && (
              <div style={{ position: "relative" }}>
                <MapBox
                  id="scroll-map"
                  lat={pothole.location.lat}
                  lng={pothole.location.lng}
                  zoom={zoom}
                  mapClass="map-scroll"
                  updateLat={setLat}
                  updateLng={setLng}
                  displayOnly={true}
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

            <h5>Cost Information</h5>

            {pothole && pothole.cost && (
              <FormGroup>
                <Input
                  type={"text"}
                  name={"cost"}
                  value={pothole.cost}
                  disabled
                ></Input>
              </FormGroup>
            )}
            {pothole && pothole.materials && (
              <FormGroup>
                <Input
                  type={"text"}
                  name={"materials"}
                  value={pothole.materials}
                  disabled
                ></Input>
              </FormGroup>
            )}
            {pothole && pothole.priority && (
              <FormGroup>
                <Input
                  type={"text"}
                  name={"priority"}
                  value={`Priority: ${pothole.priority}`}
                  disabled
                ></Input>
              </FormGroup>
            )}

            {/* <BigInput
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
          </FormGroup> */}

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
          </Form>
        </ScrollSection>
        {isDesktop && pothole.location && (
          <div className="col-md-8">
            <MapBox
              // id="scroll-map"
              lat={pothole.location.lat}
              lng={pothole.location.lng}
              zoom={zoom}
              mapClass="map-half-page"
              updateLat={setLat}
              updateLng={setLng}
              displayOnly={true}
              setParish={setParish}
            ></MapBox>
          </div>
        )}
      </div>
    </div>
    // </div>
  );
};

export default ViewAPothole;
