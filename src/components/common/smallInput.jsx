import React from "react";
import { FormGroup, Form, Input } from "reactstrap";

const SmallInput = (props) => {
  return (
    <FormGroup>
      <Input
        className="border rounded"
        type={props.type}
        name={props.name}
        id="exampleName"
        placeholder={props.placeholder}
      />
    </FormGroup>
  );
};

export default SmallInput;
