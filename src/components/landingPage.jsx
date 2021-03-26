import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import photo from "../images/Welcome to Vectr.png";
import { useAuth } from "../contexts/AuthContext";

const LandingPage = () => {
  const { currentUser } = useAuth();

  return (
    <React.Fragment>
      <div className="row landingPage">
        <div className="headingTextGroup col-md-6 d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex flex-column">
            <h1 className="headingText">
              HELP KEEP <br></br> BARBADOS’ <br></br> ROADS SAFE
            </h1>

            <div className="">
              {" "}
              <Button color="primary" size="lg">
                REPORT A POTHOLE
              </Button>
              {!currentUser && (
                <Button color="primary" outline size="lg" className="ml-5">
                  SIGN IN
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="headingPhotoGroup col-md-6">
          <img src={photo} className="headingPhoto"></img>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LandingPage;
