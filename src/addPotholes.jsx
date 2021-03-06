import React from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import BigInput from "./components/common/bigInput";
import ImageUploader from "./components/common/imageUploader";

import ScrollSection from "./components/common/scrollSection";
import SmallInput from "./components/common/smallInput";
import { useAuth } from "./contexts/AuthContext";

const AddPotholes = () => {
  const {
    logout,
    currentUser,
    setCurrentUser,
    currentUserData,
    setCurrentUserData,
  } = useAuth();

  return (
    <ScrollSection heading1={"Report A Pothole"} heading2={"Pothole #1375"}>
      <Form>
        <ImageUploader />
        <FormGroup>
          <Input type="select" name="size">
            <option>Small</option>
            <option>Medium</option>
            <option>Big</option>
          </Input>
        </FormGroup>
        <SmallInput type={"text"} name={"location"} placeholder="Location" />
        <BigInput
          type={"text"}
          name={"description"}
          placeholder={"Description"}
        />
        <div className="d-flex justify-content-between">
          {currentUserData &&
            (currentUserData.role == "person" ||
              currentUserData.role == "manager") && (
              <Button color="primary" outline>
                Add Cost
              </Button>
            )}
          {currentUserData && currentUserData.role === "manager" && (
            <Button color="primary" outline>
              Add Schedule
            </Button>
          )}
          <Button color="primary">Submit</Button>
        </div>
      </Form>
    </ScrollSection>
  );
};

export default AddPotholes;
