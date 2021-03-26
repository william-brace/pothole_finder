import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

const LongCard = ({ potholes }) => {
  return potholes.map((pothole) => {
    return (
      <div className="long-card my-2">
        <img src={pothole.images[0]} alt={pothole.description} />
        <div className="long-card--text ml-2">
          <h4 className="long-card--text_title mt-2 mb-0">{pothole.name}</h4>
          <div className="long-card--text_stats">
            <div className="d-flex align-items-center">
              <h6 className="mr-3 mb-0 my-1">{pothole.parish}</h6>
              <h6 className="my-1">{pothole.size}</h6>
            </div>
            <h6 className="text-primary">25 Fix It's!</h6>
          </div>
        </div>
        <div className="long-card--buttons ml-auto">
          <Button color="primary" outline size="lg" className="mx-4">
            Fix It!
          </Button>
          <Button color="primary" size="lg" className="mx-4">
            <Link to={`/viewapothole/${pothole.id}`} style={{ color: "white" }}>
              View
            </Link>
          </Button>
        </div>
      </div>
    );
  });
};

export default LongCard;
