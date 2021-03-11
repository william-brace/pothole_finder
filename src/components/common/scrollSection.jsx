import React from "react";
import { FormGroup } from "reactstrap";

const ScrollSection = (props) => {
  return (
    <div className="border p-3">
      <h1>{props.heading1}</h1>
      <h2>{props.heading2}</h2>
      <FormGroup>{props.children}</FormGroup>
    </div>
  );
};

export default ScrollSection;
