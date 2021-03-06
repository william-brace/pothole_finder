import React from "react";
import { FormGroup } from "reactstrap";

const ScrollSection = (props) => {
  return (
    <div className="container-md w-md-25 border p-3">
      <h1>{props.heading1}</h1>
      <h2>{props.heading2}</h2>
      <FormGroup>{props.children}</FormGroup>
    </div>
  );
};

export default ScrollSection;
