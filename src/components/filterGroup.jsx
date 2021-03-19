import React, { useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

const FilterGroup = ({
  filters,
  filtersName,
  selectedIndex,
  onRadioChange,
}) => {
  return (
    <Form className="mt-4">
      <h5>{filtersName}</h5>
      {filters.map((filter, index) => (
        <FormGroup check key={filter}>
          <Label check>
            <Input
              type="radio"
              name={filtersName}
              checked={index === selectedIndex}
              onChange={() => onRadioChange(filter, index)}
            />
            {filter}
          </Label>
        </FormGroup>
      ))}
    </Form>
  );
};

export default FilterGroup;
