import React, { useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

const FilterGroup = ({ filters, filtersName, onFilterSelect }) => {
  return (
    <Form className="mt-4">
      <h5>{filtersName}</h5>
      {filters.map((filter, index) => (
        <FormGroup check key={filter}>
          <Label check>
            <Input
              type="radio"
              onClick={() => onFilterSelect(filter)}
              name={filtersName}
              defaultChecked={index === 0}
            />
            {filter}
          </Label>
        </FormGroup>
      ))}
    </Form>
  );
};

export default FilterGroup;
