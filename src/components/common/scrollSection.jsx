import React from "react";
import { FormGroup } from "reactstrap";

const ScrollSection = (props) => {
  return (
    <div
      className="scroll-section col-md-4  border"
      style={{ padding: "2rem" }}
    >
      <h1>{props.heading1}</h1>
      <h2>{props.heading2}</h2>
      <FormGroup>{props.children}</FormGroup>
    </div>
  );
};

export default ScrollSection;
