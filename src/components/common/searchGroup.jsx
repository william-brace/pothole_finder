import React from "react";
import { Button, Input, InputGroupAddon, InputGroup } from "reactstrap";

const SearchGroup = ({ onSearch, value }) => {
  return (
    <InputGroup size="lg" className="mt-2 mb-4 ml-4 mr-4 w-100 shadow-sm ">
      <Input
        placeholder="Name of pothole..."
        className="border-0"
        value={value}
        onChange={(e) => onSearch(e.currentTarget.value)}
      ></Input>
      <InputGroupAddon addonType="append">
        <Button color="primary">Search</Button>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchGroup;
