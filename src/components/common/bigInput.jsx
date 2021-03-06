import React from "react";
import { FormGroup, Input } from "reactstrap";

const BigInput = (props) => {
  return (
    <FormGroup>
      <Input
        className="border rounded py-5 px-5"
        type={props.type}
        name={props.name}
        id="exampleName"
        placeholder={props.placeholder}
      />
    </FormGroup>
  );
};

export default BigInput;
